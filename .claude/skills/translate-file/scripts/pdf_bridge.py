#!/usr/bin/env python3
"""
pdf_bridge.py - Convert PDF to DOCX using pdf2docx.

Pre-processing step before extract_docx.py: pdf2docx preserves layout (tables,
columns, fonts, spacing) far better than the Calibre HTMLZ → Markdown path,
so PDF files can benefit from the DOCX-native format-preserving pipeline.
"""

import argparse
import os
import sys


def convert_pdf_to_docx(pdf_path, output_docx, start=0, end=None):
    """Convert a PDF file to DOCX using pdf2docx. Returns True on success."""
    try:
        from pdf2docx import Converter
    except ImportError:
        print("pdf2docx not installed. Install with: pip install pdf2docx")
        return False

    try:
        cv = Converter(pdf_path)
        cv.convert(output_docx, start=start, end=end)
        cv.close()
    except Exception as e:
        print(f"pdf2docx conversion failed: {e}")
        return False

    if not os.path.exists(output_docx):
        print("pdf2docx: output DOCX not created")
        return False

    size = os.path.getsize(output_docx)
    print(f"pdf2docx: {pdf_path} → {output_docx} ({size:,} bytes)")
    return True


def main():
    parser = argparse.ArgumentParser(description="Convert PDF to DOCX via pdf2docx")
    parser.add_argument("pdf_file", help="Input PDF file")
    parser.add_argument("-o", "--output", required=True, help="Output DOCX path")
    parser.add_argument("--start", type=int, default=0, help="First page (0-based, default 0)")
    parser.add_argument("--end", type=int, default=None, help="Last page exclusive (default: all)")
    args = parser.parse_args()

    if not os.path.exists(args.pdf_file):
        print(f"Error: {args.pdf_file} not found")
        sys.exit(1)

    os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)

    if not convert_pdf_to_docx(args.pdf_file, args.output, args.start, args.end):
        sys.exit(1)


if __name__ == "__main__":
    main()
