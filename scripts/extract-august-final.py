#!/usr/bin/env python3
"""Extract the verified August 2026 workbook into a stable JSON import payload.

This deliberately reads cached values from the Excel file so it can run without
adding a spreadsheet dependency to the production website.
"""

from __future__ import annotations

import json
import re
import sys
import unicodedata
from datetime import date, datetime, timedelta
from pathlib import Path
from xml.etree import ElementTree as ET
from zipfile import ZipFile


MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS = {"m": MAIN_NS, "r": REL_NS}


def plain(value: str) -> str:
    return "".join(
        char
        for char in unicodedata.normalize("NFD", value.lower())
        if unicodedata.category(char) != "Mn"
    ).replace("đ", "d")


def number(value: object) -> int:
    try:
        return int(float(value or 0))
    except (TypeError, ValueError):
        return 0


def text(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def parse_date(raw: object, previous: date | None) -> date | None:
    if raw in (None, ""):
        return previous

    if isinstance(raw, (int, float)):
        serial = int(raw)
        if serial >= 40000:
            parsed = (datetime(1899, 12, 30) + timedelta(days=serial)).date()
            if parsed.year == 2026 and parsed.month == 8:
                return parsed
            # Several cells such as 02/08 were parsed by Excel as 08/02.
            # Their position in the August tab makes the intended date clear.
            if parsed.year == 2026 and parsed.day == 8 and 1 <= parsed.month <= 12:
                return date(2026, 8, parsed.month)
            return parsed

        compact = str(serial)
        if len(compact) in (3, 4) and compact.endswith("08"):
            return date(2026, 8, int(compact[:-2]))

    match = re.match(r"\s*(\d{1,2})\s*/\s*(\d{1,2})", str(raw))
    if match:
        return date(2026, int(match.group(2)), int(match.group(1)))
    return previous


def cell_column(reference: str) -> tuple[str, int]:
    match = re.match(r"([A-Z]+)(\d+)", reference)
    if not match:
        raise ValueError(f"Invalid cell reference: {reference}")
    return match.group(1), int(match.group(2))


def find_sheet(sheets: list[tuple[str, str]], wanted: str) -> str:
    wanted_plain = plain(wanted)
    for title, path in sheets:
        if plain(title) == wanted_plain:
            return path
    raise ValueError(f"Không tìm thấy sheet {wanted} trong file nguồn.")


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    if len(sys.argv) != 2:
        raise SystemExit("Usage: extract-august-final.py <workbook.xlsx>")

    workbook_path = Path(sys.argv[1])
    with ZipFile(workbook_path) as archive:
        shared_strings: list[str] = []
        if "xl/sharedStrings.xml" in archive.namelist():
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            for item in root.findall("m:si", NS):
                shared_strings.append("".join(node.text or "" for node in item.iter(f"{{{MAIN_NS}}}t")))

        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        relationship_paths = {item.attrib["Id"]: item.attrib["Target"] for item in relationships}
        sheets: list[tuple[str, str]] = []
        for item in workbook.find("m:sheets", NS):
            relation = item.attrib[f"{{{REL_NS}}}id"]
            path = relationship_paths[relation]
            sheets.append((item.attrib["name"], path if path.startswith("xl/") else f"xl/{path}"))

        def read_sheet(path: str) -> dict[int, dict[str, object]]:
            root = ET.fromstring(archive.read(path))
            rows: dict[int, dict[str, object]] = {}
            for cell in root.findall(".//m:sheetData/m:row/m:c", NS):
                column, row_number = cell_column(cell.attrib["r"])
                raw_value = cell.find("m:v", NS)
                value: object = raw_value.text if raw_value is not None else ""
                if cell.attrib.get("t") == "s" and value != "":
                    value = shared_strings[int(str(value))]
                elif cell.attrib.get("t") == "inlineStr":
                    value = "".join(node.text or "" for node in cell.findall(".//m:t", NS))
                elif value != "":
                    try:
                        value = float(str(value)) if "." in str(value) else int(str(value))
                    except ValueError:
                        pass
                rows.setdefault(row_number, {})[column] = value
            return rows

        sheet_specs = (
            ("Miên T8", "Miên", "J", "I"),
            ("TRINH", "Trinh", "J", "I"),
            ("Trang T8", "Trang", "K", "J"),
            ("làm trả tua ngoài", "Tua ngoài", "J", None),
        )
        records: list[dict[str, object]] = []

        for sheet_name, employee, technician_column, consultant_column in sheet_specs:
            rows = read_sheet(find_sheet(sheets, sheet_name))
            latest_date: date | None = None
            for row_number in range(5, 132):
                row = rows.get(row_number, {})
                latest_date = parse_date(row.get("A"), latest_date)
                values = {column: row.get(column, "") for column in "ABCDEFGHIJK"}
                technician_amount = number(values[technician_column])
                consultant_amount = number(values[consultant_column]) if consultant_column else 0
                has_source_data = any(text(values[column]) for column in ("B", "C", "D", "E", "F", "G", "H"))
                if not has_source_data and technician_amount == 0 and consultant_amount == 0:
                    continue
                if latest_date is None:
                    raise ValueError(f"Dòng {row_number} của sheet {sheet_name} không có ngày.")

                sale_amount = number(values["F"])
                package_tag = text(values["B"])
                gift_tag = text(values["G"])
                technical_tag = text(values["H"])
                is_external = employee == "Tua ngoài"
                if is_external:
                    sale_type = "external_tour"
                elif sale_amount > 0 and (package_tag or gift_tag or technical_tag or consultant_amount > 0 and technician_amount == 0):
                    sale_type = "package_sale"
                elif sale_amount > 0:
                    sale_type = "retail"
                elif "tang" in plain(gift_tag):
                    sale_type = "gift"
                else:
                    sale_type = "package_usage"

                source_service = text(values["E"])
                if not source_service:
                    source_service = "Bán gói / thẻ" if sale_amount > 0 else "Dịch vụ chưa ghi"

                records.append(
                    {
                        "source_ref": f"excel-t8-final-2026:{plain(employee).replace(' ', '-') }:{row_number}",
                        "sheet": sheet_name,
                        "row": row_number,
                        "employee": employee,
                        "service_date": latest_date.isoformat(),
                        "customer_name": text(values["D"]) or "Khách chưa ghi tên",
                        "service_name": source_service,
                        "sale_type": sale_type,
                        "revenue_amount": sale_amount,
                        "technician_amount": technician_amount,
                        "consultant_amount": consultant_amount,
                        "package_tag": package_tag,
                        "gift_tag": gift_tag,
                        "technical_tag": technical_tag,
                    }
                )

    totals = {
        "lines": len(records),
        "revenue": sum(int(record["revenue_amount"]) for record in records),
        "technician": sum(int(record["technician_amount"]) for record in records),
        "consultant": sum(int(record["consultant_amount"]) for record in records),
    }
    print(json.dumps({"records": records, "totals": totals}, ensure_ascii=False))


if __name__ == "__main__":
    main()
