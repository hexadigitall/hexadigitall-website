#!/usr/bin/env python3
"""Build student KDP paperback manuscript for Architecting Landing Zones."""
from pathlib import Path

from build_kdp_landing_zones_common import ROOT, build

SRC = ROOT / 'public/textbooks/kdp/architecting-landing-zones/architecting-landing-zones-student-textbook.html'
DEST = ROOT / 'public/textbooks/kdp/architecting-landing-zones/architecting-landing-zones-kdp-6x9.html'

build(SRC, DEST, edition='Student', binding='6x9 Paperback', sanitize_student=True)
