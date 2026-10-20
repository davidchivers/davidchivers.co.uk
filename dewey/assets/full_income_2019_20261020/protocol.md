# Full 2019 home-area income accounting

20 October 2026. Specified after the successful fixed engineering pilot
(note 114), after explicit full-year approval, and before full reconstruction.
This is a new scope, not a retrospective alteration of the pilot protocol.

## Inputs and unresolved upstream integrity

Use exactly the three already fingerprinted 2019 derived files, read-only:
annual CBG flows, harmonized ACS lookup and final harmonized POI indices.
The private configuration supplies paths and exact SHA-256 pins.
Use the 2015-2019 ACS five-year wave harmonized to 2020 CBGs. Retain both
preferred NHGIS (`tdw`, checked against its `nhgis` alias) and strict deciles.
Income groups rank CBG median household income nationally without population
weighting. They are not personal income, per-capita income or equal-population
groups.

David has reported corrupted raw downloads, but cannot currently identify
which years are affected. Do not open the raw archive directory while files
are being replaced. Full derived-file reconciliation cannot certify original
weekly completeness, source deduplication or raw integrity. Report that
limitation even if all new internal checks pass.

## Estimand and support fixed before the run

Let G be the ten home-area income groups, V the recorded destination venue,
K its literal final-file SUB_CATEGORY, and A its destination county.
Weight by recorded positive annual origin-flow mass, not annualized visits
or independent people. Exclude origins without a valid group from the
classified numerator and denominator, without imputation. Retain known
unclassified mass and counts of null/zero weights separately.

Reconstruct every matched venue, rather than the pilot's sampled subset.
Compare both full ID rosters and the recorded MSA_CODE and combined_category
fields before permitting accounting. Reconcile all nine inherited scalars
per venue at absolute tolerance 1e-8 and relative tolerance 1e-9. Any
unmatched/duplicate ID, metadata conflict, malformed flow, invalid group,
changed source fingerprint or scalar mismatch withholds all accounting.
Do not discard failing rows and continue on the rest.

Eligible support is positive classified mass and a nonmissing valid county
and subcategory. Count exclusions in the fixed order: missing county,
missing subcategory, no classified mass; also report overlapping flags.
Unlike the city-level engineering pilot, **missing MSA_CODE is not a national
accounting exclusion**. Count it explicitly and retain those venues when
county/category/income support exists. Do not restrict to metropolitan areas.
Each income variant has its own support; their difference is not a
fixed-support treatment effect.

Pool the eligible national recorded-venue universe for each variant. Report:

    I(G;V) = I(G;K) + I(G;A|K) + I(G;V|A,K)
           = I(G;A) + I(G;K|A) + I(G;V|A,K).

These are exact descriptive information identities, not causal shares.
Compute in nats and divide every component by the same pooled H(G) for
normalized results. If H(G)=0, normalized values are undefined, not zero.
If reporting component shares of total separation I(G;V), state that
different denominator explicitly and withhold it when I(G;V)=0.
Report both orders together. Within county/category is not within a common
shopping centre, matched local choice set, or product-adjusted preference.
No city-size, attitude, causal or structural-preference regression is run.

## Execution and verification

Keep all detailed rows, vector files, indices, scratch files and receipts
outside Git in new private storage; never overwrite the pilot. Use bounded
Parquet batches, a disk-backed exact-ID index, a lookup cap of 500,000 and a
hard venue cap of 5,000,000. The known input roster is 3,526,891 venues;
resource limits cannot silently truncate or sample it. Preserve partial
artifacts on failure, clearly marked unusable for release. Retain the
wrapper's vector file, roster index and receipt; disposable DuckDB scratch
is cleaned on both success and failure, not preserved as a forensic record.

Reuse the verified pure reconstruction function. The scalable accounting
engine must independently compare direct KL calculations to conditional
entropy differences and test both chain identities, with 1e-10 numerical
tolerance. Test artificial files against the existing reference engine,
including reordered rows, repeated county/category labels, zero entropy,
duplicates and malformed masses. Bind code/protocol/input hashes; check
source size/mtime and code stability at completion. Verify the retained
overlap with the prior independently checked pilot vectors without claiming
that the original raw reconstruction or old empirical tests were rerun.

## Disclosure and interpretation

Initially release only pooled national accounting and technical support
diagnostics, after separate inspection. Require at least 1,000 retained
venues, ten counties, ten categories, and no single venue exceeding 1% of
classified mass in each released variant. Keep county/category outcomes,
group vectors, identifiers and all source rows private. These gates reduce
disclosure risk; they do not establish representative device coverage.
Do not publish selected local examples or top/bottom categories under this
protocol.

The expected output is a paired national accounting table, support table,
clear definitions and a continue/narrow/stop assessment. Interpret as
home-area income sorting among recorded destination visits, conditional on
the supplied derived data. Retain nulls and all components. No confidence
interval or person-level significance claim is justified by treating flow
mass as a count of independent people.
