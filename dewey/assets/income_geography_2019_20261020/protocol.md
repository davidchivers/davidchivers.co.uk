# Finer local geography in the 2019 income accounting

Prospective protocol, 20 October 2026. Stage A is a geography-only audit.
Stage B is the ensuing bounded income comparison, conditional on the audit
and a separately frozen execution implementation. No outcome-dependent
boundary choice or new city-size, attitude or causal regression is authorized.

## Question and interpretation

How much of the measured separation between venues in the same county and
literal subcategory remains when the geographic comparison is made smaller?
County-level residual separation can reflect distinct local markets. This
exercise tests that descriptive explanation. It does not identify shared
choice sets, preferences, discrimination, interpersonal contact or a causal
effect of urban scale.

The existing full-national accounting is retained unchanged. This extension
uses the contiguous 48 states and DC, specified now because EPSG:5070 provides
one suitable metric projection for this region. Alaska, Hawaii and territories
are not silently projected into it or represented by the new result.

## Approved inputs and provenance

Use only the approved `poi_identifiers_2019.csv.gz`, the verified full-year
2019 reconstruction and the previously acquired public 2019 TIGER/Line county
ZIP. No original weekly archives or new personal/employee data are used.
Original byte identities must match construction logs 117/119 and the frozen
launch receipt, before and after execution. Private working files remain
outside Git. Never display venue coordinates, identifiers or local-cell rows.

Stage A projects only the ID and recorded county columns from the verified
income vectors; it must not load income-group cells or flow weights.
The roster is the union of venues represented in either positive-income
lookup, not all venues in the original provider product. Check that county
labels are invariant across lookup rows and each variant-ID pair is unique.

## Stage A: coordinates and county reconciliation

1. Read the named identifier file as text; require the documented 2019 year.
   Empty keys are unavailable, not a substitute identifier. Trim surrounding
   identifier whitespace as in the previous geographic audit and count that
   normalization. Report any duplicated normalized keys privately.
2. A usable key has exactly one distinct finite latitude/longitude pair in
   the geographic ranges, and no invalid coordinate row. Exact repeated pairs
   may collapse to one key. Conflicting pairs or valid/invalid duplicates are
   unresolved; do not select the first row, average or nearest location.
3. Join by the existing venue ID without fuzzy matching. Keep unmatched and
   unusable records in the private audit ledger. Do not multiply income IDs.
4. Treat the source coordinates as WGS84 only as an explicitly unverified
   operational assumption. Select the available PROJ inverse of
   `NAD83 to WGS 84 (1)` with longitude-first axes, 4 metre stated operation
   accuracy and its recorded area of use. Disable projection-network access.
   This operation's accuracy is not evidence about provider geocoding accuracy.
   Points outside its area of use remain unprocessed.
5. Match points against the unchanged EPSG:4269 2019 county polygons with
   `covered_by`. Exactly one polygon is required. Zero matches, overlapping
   polygons and exact shared borders remain unresolved. No geometry repair,
   nearest-county assignment, buffer enlargement or county-code correction.
6. Keep both recorded and coordinate-derived county. Their agreement is a
   test, not an enforced relabeling. A finer-area eligible venue must have a
   recorded CONUS/DC county, one valid coordinate, one polygon match, and
   exact agreement of the two counties. NAD83 coordinates are then projected
   to EPSG:5070 with longitude-first axes. Failed/nonfinite transforms remain
   unresolved.
7. Require all finite linked records to satisfy roster reconciliation. Before
   a national-style CONUS interpretation, at least 99% of the recorded
   CONUS/DC union roster must satisfy the geographic eligibility rule.
   If not, report the coverage failure and investigate its cause without
   relaxing this threshold or presenting selected geographies as national.
8. Independently check the fixed SHA-256 ID modulo-10,000 sample, with a
   5,000-venue safety cap. Use direct polygon predicates rather than the
   production spatial index. No reselection or truncation. Verify each
   sample assignment and match count, plus exact output roster uniqueness.

Only coarse national audit statements may be proposed for release: whether
the exact checks pass and whether eligibility exceeds the fixed 99% floor.
Detailed exclusion counts, coordinates and geographic labels remain private
until a separate disclosure review. A successful audit is not original-file
replication or certification of the provider's geography vintage.

## Stage B: fixed partitions and common support

Before reading new income contrasts, use square grids in EPSG:5070 with
side lengths 20,000, 10,000, 5,000 and 2,500 metres. The primary descriptive
scale is 5,000 metres. The main grid origin is (0,0); an origin-shift
sensitivity adds (1,250,1,250) metres to that origin at every scale.
Use floor((coordinate - origin) / side), including negative coordinates.
Each sequence is nested. Intersect cells with recorded county and literal
subcategory in the accounting; this preserves the county-level chain rule.
The eight partitions are fixed as a family, not alternatives from which to
select a favourable result.

Use one common venue-ID support for both income lookups: geography-eligible
venues with positive classified mass in both variants. Preserve the existing
ACS wave, group definitions and weights; no income imputation. Recompute the
county/subcategory benchmark on that exact common support. Show the change
from the earlier national sample separately, not as a geographic effect.

For each lookup let G be home-area income group, V venue, A county, K literal
subcategory, and L a fixed grid cell. On the same support and mass measure:

I(G;V | A,K) = I(G;L | A,K) + I(G;V | A,K,L).

Report components in nats, as fractions of H(G), and as shares of the same
within-county/subcategory benchmark. A shrinking within-cell residual is
partly mechanical as the partition becomes finer. Therefore also report
the national classified-flow share in singleton cells and an explicitly
separate multi-venue-cell diagnostic, without dropping singleton cells
from the primary identity. Cell-level comparisons are not released.

Primary release is one joint national eight-partition family, both lookups,
with the benchmark and support accounting. No category rankings, top-five
statistics, selected restaurants, county results or maximum/minimum cells.
The implementation must freeze joint support/contribution/disclosure screens
and independent arithmetic checks before Stage B execution. These screens
must consider the existing national release and new common-support/excluded
remainders. Do not revive or bypass note 118's separately stopped category
release. Stop or narrow the interpretation if tiny cells or sample loss
make the result uninformative.

## Decision

Continue the local-market branch only as descriptive measurement if support
and numerical checks pass and the complete scale profile is interpretable.
A large reduction supports the importance of finer geography in accounting,
not a causal travel-cost mechanism. A substantial residual motivates
independent product or common-centre data, not a claim of social preferences.
A failed support or disclosure screen is preserved, with no substitute
boundary search.

## Technical sources

The public boundary release is documented in construction log 119.
[Census TIGER/Line documentation](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html)
and the installed [pyproj transformer documentation](https://pyproj4.github.io/pyproj/stable/api/transformer.html)
were checked on 20 October. The documented axis-order, operation-accuracy
and area-of-use distinctions govern the implementation.
