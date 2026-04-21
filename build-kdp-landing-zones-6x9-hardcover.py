#!/usr/bin/env python3
"""Build student KDP hardcover manuscript for Architecting Landing Zones."""
from build_kdp_landing_zones_common import ROOT, build

SRC = ROOT / 'public/textbooks/kdp/architecting-landing-zones/architecting-landing-zones-kdp-6x9.html'
DEST = ROOT / 'public/textbooks/kdp/architecting-landing-zones/architecting-landing-zones-kdp-6x9-hardcover.html'

build(SRC, DEST, edition='Student', binding='6x9 Hardcover', hardcover=True)
