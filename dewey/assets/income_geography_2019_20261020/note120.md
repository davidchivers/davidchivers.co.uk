# Can the 2019 income accounting support finer local geography?

20 October 2026. Completed coordinate and county audit; no new income result.

## Main finding

The pre-specified geographic coverage check passes. At least 99% of the
recorded contiguous-US/DC venue roster used in either 2019 income construction
has a usable coordinate, exactly one matching 2019 county polygon, agreement
with its recorded county, and a finite projected location. The saved roster
reconciles exactly, without adding or duplicating venues. The fixed direct
polygon sample agrees with the production spatial-index assignments.

This is useful groundwork for asking whether apparently separate venues
simply serve different parts of a county. It is **not** evidence that the
within-local-area income result is large, small or zero: that calculation
has not run.

## What was checked

The authorized identifier file was linked locally, read-only, to the union of
venues represented in either positive-income lookup in the verified full-year
reconstruction. Only identifiers, lookup labels and recorded counties were
read from that reconstruction, not income-group masses or flow weights.
The independent geographic reference is the public 2019 Census TIGER/Line
county release, acquired and checked in construction log 119.

Coordinate duplicates with exactly the same valid pair were collapsed.
Conflicting pairs, invalid values and unmatched identifiers remained
unresolved. There was no fuzzy matching, nearest-county assignment, coordinate
averaging, polygon repair or correction of provider county codes. A point
covered by two county polygons was not assigned arbitrarily to either.

The geographic extension is explicitly limited to the contiguous 48 states
and DC. Alaska, Hawaii and territories remain in the earlier national
accounting where eligible, but are not silently included in this projection.
The 99% floor applies to this extension's recorded-CONUS/DC union roster,
not every venue in the provider's product or a visit-weighted population.

## Why this does not settle measurement validity

The provider's coordinate datum is still an unverified operational WGS84
assumption. The selected transformation's stated four-metre accuracy is not
evidence of four-metre geocoding accuracy. Agreement with a county boundary
does not establish the correct venue address, historical venue location,
provider geography vintage, completeness of original weekly archives or
correctness of the original demographic construction.

The original 2017-2019 Hamilton replication remains a separate task.
The reported archive corruption still has unknown year coverage. No archive
under replacement was opened, and no Hamilton production job was run.

## The question this enables

The unchanged national accounting in note 117 assigns 52.09% of measured
home-area-income separation to venues within recorded county/subcategory
cells under the preferred lookup. That residual can include different
neighbourhoods, travel distances and local markets.

The next pre-specified comparison partitions each county/subcategory into
20 km, 10 km, 5 km and 2.5 km square grids, with a second shifted origin.
Five kilometres is the primary descriptive scale. All eight partitions will
be considered together, using the same geographically eligible venue support
for both income lookups and a freshly computed county baseline on that support.
No favourable boundary or category will be selected after seeing results.

The accounting will separate the county/subcategory residual into separation
between smaller cells and separation between venues inside those cells.
A decline in the residual is partly mechanical as cells become smaller,
especially where only one venue remains. Singleton flow and support therefore
need explicit reporting. Neither a small grid nor a residual identifies a
shared choice set, social preferences, discrimination or causal travel costs.

## Status and sources

The geography-only run completed in 126.5 seconds. Preflight software tests
and independent code review preceded the frozen launch. The construction
record gives exact source, code and output identities and distinguishes the
run's direct-predicate sample from the separate saved-ledger verification.
A separately implemented verifier confirms the saved roster, eligibility,
diagnostics, coverage gate and unchanged hashes. It does not independently
reproject or rematch the original points. Its initial Windows path-format
failure and correction are retained in the construction record.

The next income calculation still needs a frozen implementation and joint
disclosure review, including comparison with already released totals.
Note 118's category-release stop remains in force; this extension does not
authorize publication of category rankings or small local cells.

- Complete construction record: `docs/data_construction/120_income_geography_audit.md`.
- Fixed protocol: `docs/protocols/income_finer_geography_2019_20261020.md`.
- Earlier national result: `notes/117_full_2019_income_accounting.md`.
- Category disclosure stop: `notes/118_income_category_accounting.md`.
- Public boundary acquisition: `docs/data_construction/119_income_geography_reference.md`.

Only the coarse coverage threshold and check status are reported here.
Venue identifiers, coordinates, local cells and detailed exclusion counts
remain in private storage. This note does not certify publication readiness.
