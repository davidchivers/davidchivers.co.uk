# Construction log 117: full 2019 income accounting

20 October 2026. Complete operations record for this milestone; not a
replacement for the original Hamilton pipeline or the earlier pilot record.

## Permission and prospective scope

David explicitly approved the full-2019 extension using the same three
named derived files. DATA_POLICY records the scope. The separate prospective
protocol is `docs/protocols/full_income_accounting_2019_20261020.md`.
It was frozen before the full run. Original weekly data, other years,
city-size/attitude regressions and new coordinate linkages were not included.

The concurrent raw-archive report is unresolved by year: David answered
"dunno" when asked which years are intact. No raw archive was opened,
tested, copied, repaired or overwritten. Existing derived-file identities
were frozen independently of the replacement process.

## Input identities and semantics

| Role | Basename | Bytes | SHA-256 |
|---|---|---:|---|
| Annual origin flows | poi_annual_cbg_flows_2019.parquet | 4,909,225,273 | 384e39110e133cceb4a6f7691863258a8d882ef2217eb5554b89ca7281156663 |
| ACS lookup | acs2019_cbg_harmonized_2020.parquet | 30,294,897 | 2583dea93e1d20ff325d5c3a68012d2dcf9bff5e97dca6b26e3d1e1375dade21 |
| Saved POI indices | poi_indices_harmonized_2019.parquet | 2,471,813,652 | dd4aff1f85092ae17dff7e0d4b5c6ff0748e9af9caade9bfc6e706a5ab5b4890 |

Paths and operational configurations remain private. Use the existing private
`full_income_accounting_2019_20261020` execution folder, not a new download.
Each original was hashed before processing and its size/modification time
checked after execution. No input was changed.

The 2015-2019 ACS wave, 2020 harmonized CBGs, national unweighted
median-household-income deciles and preferred/strict mappings were retained.
No per-capita-income or worker data enter. Classified income is renormalized
over usable origins; null weights remain unknown. Recorded positive origin
counts are not independent annual visitors or annualized raw visits.

## Implementation and prelaunch review

The main process wrote a new bounded runner and a focused worker implemented
the disk-backed information engine. A second GPT-6.1-sol worker performed
static review; Main integrated and verified. Restricted rows were never
provided to either model. Only Main's authorized local process opened the
three named derived inputs.

The runner builds an exact-ID SQLite index, reconstructs every venue in
4,096-row batches, compares metadata and nine saved scalars, and writes
private ten-group venue vectors. Lookup and venue limits are 500,000 and
5,000,000; exceeding either fails, not truncates. Eligibility exclusions
follow the fixed county/subcategory/classified-mass order. Missing recorded
MSA does not remove an otherwise eligible venue from national accounting.

The engine uses two DuckDB threads and a 2 GB engine buffer limit with
private spill storage. This is not a process-RSS cap. It checks explicit
nonnegative ten-group vectors, mass totals and duplicate venue-lookup keys,
then computes pooled national group/category/county/venue information.
Both ordering identities and direct-KL versus conditional-entropy calculations
must agree within 1e-10. Each lookup uses its own support and pooled entropy.
Temporary engine tables/spill are removed; wrapper vectors, roster and
receipts are retained privately.

Prelaunch review found a batch-flush branch hazard and a resource cap checked
too late. Both were corrected before real execution and covered by tests.
Eighty-five focused tests then passed. No failed production run preceded
this full-year launch; the interrupted network-storage pilot belongs to
the earlier, separately retained note 114 history.

Six execution files were snapshotted and hash-frozen: the runner, information
engine, prior engineering adapter, flow-contract module, timestamp/helper
module, and this run's prospective protocol. The private launch manifest has
SHA-256 `8bf1e7044c448c2f6c355b908c46f3e8f476a0ba4cebba8de219a922cbd9f08d`.
All six match the completion receipt and current source. Their exact hashes
are in the released aggregate's provenance and documentation manifest.

## Actual execution and checks

The one local production process started at **16:30:18 BST** and completed
at **17:10:04 BST** on 20 October. Elapsed time was **2,385.781 seconds**.
This includes source hashing, complete roster/index construction,
reconstruction and national accounting. It excludes later verification,
tests, review and presentation. No Hamilton login or job submission occurred.

- Full final/flow rosters: 3,526,891 one-to-one IDs; no unmatched IDs or
  duplicate identifiers.
- Recorded MSA and combined-category conflicts: zero.
- Scalar comparisons: 31,742,019; failures: zero; maximum absolute
  discrepancy: 8.88e-16. Limits: absolute 1e-8 and relative 1e-9.
- Source size/mtime and all six execution fingerprints unchanged.
- Both national lookup outputs present and all engine accounting checks pass.

The separate verifier opens closed SQLite snapshots read-only/immutable,
rejects WAL/SHM/journal sidecars, requires exact execution/artifact maps and
the independently pinned launch manifest, and rehashes artifacts after use.
It reaggregates stored original-scalar support and weighted coverage from
the full-run roster. Both retained counts and national masses match exactly.
This is a second calculation from saved source scalars, not a fresh reread
of the original POI source.

It also binds the prior pilot's independent source reconstruction by its
verification hash
`e0cf66b38d6eed1a7089219c63867839947988930d53b3620b7344a8654892cb`
and its three artifact hashes. All **6,686 retained venue-lookup vectors**
join exactly with no missing rows, membership conflicts or group-mass
differences. The previous source verification is reused, not rerun.
This does not independently reconstruct all new full-year vectors twice.

The verifier recomputes both accounting identities and checks bounds and
common-entropy normalization from numerical values; it does not merely trust
saved "passed" flags. The full-run roster hash is captured after execution,
then checked for stability. It was not included in the producer receipt:
record that limitation rather than claiming producer-bound database identity.

## Reporting safeguards and release

Review of the first release verifier identified weak snapshot/identity
checks and reliance on saved residual flags. These were tightened separately
while the six execution sources remained frozen. Synthetic integration tests
now reject altered artifacts, changed pilot membership/vectors, incorrect
retained counts, incomplete fingerprint maps and private-path/CLI leaks.

Review also reproduced an exporter race between hashing and parsing a file.
The exporter now captures each JSON file once, hashes and parses those same
bytes, and checks the files remain unchanged before writing. The equivalent
mutation test rejects the export without creating a candidate. This reporting
repair did not alter the empirical calculation.

The current focused suite passed **119 tests**. Records are in
`output/full_income_accounting_2019/release_checks_v2/`; earlier
`preflight/` and `release_checks/` are preserved. The renderer's final
small-label formatting change was followed by three passing renderer tests.
The successful zero-separation case displays undefined component shares
rather than inventing percentages.

The national release requires both variants to contain at least 1,000 venues,
ten counties and ten subcategories, with no single venue above 1% of
classified mass. Both pass. A separate worker checked the exact national
field whitelist, value/source correspondence, hash chain, support,
normalization, missing-income definitions and interpretation limits.
Its approval is `output/full_income_accounting_2019/disclosure_review.json`.
It did not reopen restricted source rows or rerun the old pilot.

The exact reviewed aggregate, SHA-256
`c41adda44b36ef8cdcbfd20141269b0d7100e2dbece509c97e53158e939fa900`,
was copied byte-identically to `national_aggregate.json`.
Its embedded candidate-stage label is preserved to retain byte identity;
the separate signed-off disclosure receipt establishes its release status.
No identifiers, coordinates, group vectors, county/category outcomes,
individual source rows or sparse local cells are released.

The complete 12-row CSV contains six components for each lookup, in nats,
common-entropy normalized units and shares of total separation. The dark
PNG displays both orders and lookup totals. Main inspected the rendered
image and adjusted the narrow component labels; no scientific value changed.
The render receipt binds source, review, renderer and generated bytes.

## Reproduction

Use the pinned Python/DuckDB/Arrow environment and exact named derived
release. This run used Python 3.12.10, PyArrow 23.0.1, SQLite 3.49.1 and
DuckDB 1.5.4. Matplotlib 3.10.8 renders the figure. Full dependency identities
are recorded for the local analysis, not claimed as a freeze of the original
Hamilton environment.

From the project root, with approved private paths substituted:

```powershell
python code/analysis/run_full_income_accounting_2019.py --config $PRIVATE_CONFIG
python code/analysis/verify_full_income_accounting_2019.py --full-root $NEW_PRIVATE_RUN --pilot-root $VERIFIED_PILOT --launch-manifest $PINNED_LAUNCH --output $NEW_PRIVATE_RUN/verification_income_full.json
python code/analysis/export_full_income_accounting_2019.py --root $NEW_PRIVATE_RUN --output $NEW_PRIVATE_RUN/national_release_candidate.json
```

Use a fresh output directory and preserve original runs. The verifier's
literal trust anchors refer to this named launch and prior verification;
a genuinely new execution needs a new documented manifest/pin, not a silent
replacement. Candidate generation is not permission to release: repeat the
independent disclosure review before copying a new candidate. The existing
released aggregate can be rendered without opening licensed data:

```powershell
python code/analysis/render_full_income_accounting_2019.py --source output/full_income_accounting_2019/national_aggregate.json --review output/full_income_accounting_2019/disclosure_review.json --destination $NEW_RENDER_DIRECTORY
```

The first command block documents this execution route; it does not claim a
second full-year empirical run. Original pipeline replication, raw weekly
completeness/deduplication, population representativeness, precise geography
and individual income remain unverified.

## Interpretation and delivery

Preferred normalized total separation is 0.179929; its within-county/
subcategory share is 52.09%. Strict gives 0.195204 and 54.32%, but classified
known-flow coverage falls from 97.30% to 68.00%. Differences between
constructions are not fixed-support causal effects. Both accounting orders,
all six components and earlier contrary findings are retained.

Note 117 supplies the readable result and the next narrow decision.
Local documentation, Space reconciliation, shared Project uploads and public
website delivery are separate operations. Consult the milestone delivery
receipt before describing anything as shared. No original protocol,
historical result, raw data, source code in Dropbox, invitation or colleague
message was changed by this milestone.
