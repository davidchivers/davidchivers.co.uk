# Adjusted distinct-venue comparison: construction record

20 October 2026. Empirical calculation, independent aggregate review and
summary-only release replay completed. The original preparation sequence
below is retained and the actual execution is documented afterward.
This entry implements the rank-1/rank-2 venue-count diagnostic in the active
research goal, not a new causal design. STATUS.md remains canonical.

## Scope and rationale

The 19 October authorized final-file/private-summary venue-count scope covers
this read-only reuse. `docs/protocols/distinct_venue_adjusted_comparison_20261020.md`
was frozen after the earlier category-selection result, before this new
family was estimated. It extends the existing distinct-venue count-band
diagnostic to the same two fixed-effect specifications and samples.

The sole empirical input is the immutable private continuity summary from
construction log 92. Resolve its sibling path from the already approved
18 October private execution configuration; do not copy private paths,
cell records or category labels into a public release. Its expected hash
is imported from `service_comparison_stability.py`, as is the public baseline
hash and validator. No original final source, original weekly file, worker
workbook or new ACS source is reopened.

The current raw-flow/ACS approval and exact upstream Hamilton provenance
remain separate requirements. This diagnostic does not bypass either.
Original protocols, historical outputs and failed inference gates are intact.

## Processing

The inherited validator checks the whole private cell summary and reconciles
all six national moments and support records. Cell eligibility and weights
are unchanged. The four-outcome matrix is projected on the fixed effects
using the existing alternating-projection routine and independently using
sparse dummy variables. The first three outcomes and every sample count must
reproduce the previously released 12 model records exactly within stated
floating-point tolerance. Undefined correlations stop rather than disappear.

The candidate/gate is private. The distinct-venue ratio is bounded [0,1]
but not bounded by pooled diversity; no clamping or iid-customer correction
is performed. Splitting a venue into copies intentionally demonstrates
that this conditional-pair statistic is sensitive to the venue definition.
Only independent review can clear its precisely enumerated national output.

## Commands and stage record

From the named project root, with the existing Python 3.12 environment:

```text
python -B -m unittest discover -s code/analysis -p test_distinct_venue_adjusted_comparison.py -v
python -B code/analysis/distinct_venue_adjusted_comparison.py --prior-config <approved private configuration> --run-id production --execute
python -B code/analysis/release_distinct_venue_adjusted.py --prior-config <same configuration> --run-id production --review output/distinct_venue_adjusted_20261020/review_receipt.json
```

The first command uses artificial data only. The real command is not run
until the code/protocol review is integrated. The release command is not run
until independent aggregate review clears the exact candidate fingerprint.
All output roots must be new; no historical record is overwritten.
Actual tests, outcomes, runtime, fingerprints and delivery are recorded
below, not inferred from the existence of this log.

## Actual execution and review

The independent reviewer constructed artificial venue vectors and a dense
dummy-variable reference separate from the production absorption. Its first
release tests found two defects: wholesale nested metadata copying, and
insufficient integer/coherence validation of support counts. Both were fixed.
An expanded suite then found the missing `cells <= areas * categories`
bound. That guard was also fixed before real export. The unchanged final
38-test suite passes (independent run 2.152 s; Main run 1.798 s). No actual
private metadata leak or real malformed sample was found by those tests.
The complete failure/fix record is preserved in the reviewer workstream.

The single `production` execution then completed in 10.730934 seconds.
No original POI file was reread. The private summary's pinned SHA-256 is
`9cfb030f3bb52e7ee50745b5a98f68b3e14e046f50d8b892c6d89b3d842509fb`;
the public baseline is
`75be4f375832da068d15d852bba3abf4d958290753c9e8e39a89473627ab2b74`.
The source-fingerprint, complete-family, support and baseline gates passed.
All 36 baseline correlations agree within 2.220446049250313e-16; the
independent sparse projection agrees within 7.549516567451064e-15.
The exact private candidate SHA-256 is
`c8ced95a8881bcdbff43c6d9de143594a6c36d2cfc1ae3256f76529b897fb626`.
The initial private gate's incomplete-independent-review field is a
historical processing checkpoint; it is not overwritten after review.

The reviewer subsequently received explicit bounded access to the
configuration, gate and candidate, not its input cells. It cleared the
literal model/metadata whitelist for that candidate, considering the prior
continuity and broader-category releases cumulatively. Its source-fingerprint
assessment relies on the processing gate, not an independent raw-file hash.
Detailed candidate validation, cell records, residual moments and per-model
solver details remain private. The complete private candidate is not released.

The receipt is
`output/distinct_venue_adjusted_20261020/review_receipt.json`, SHA-256
`74f33008e04b91588f22082e94d9fa04a2e7625b409b41997768a71abf799e9c`.
The reviewed exporter fingerprint is
`f3915730dfff6c64b415ed69dd669a3126760039fd346263fdc8593135827b28`.
It rechecked the candidate hash, literal approvals and exact fields before
exporting to a new `released/` directory. No restricted paths or identifying
labels were included.

## Outputs, verification and decision

Under `output/distinct_venue_adjusted_20261020/released/`:

| File | SHA-256 |
|---|---|
| all_models.csv | `1bacd85578f57ce332322de6949bdc1996c064b626a3891b85ca30edaf8ffd6f` |
| model_summary.json | `8a6333a65e84d466c91c013df75245c3c070b389dad8e85bc1429c7ba0f66cf7` |
| distinct_venue_comparison.png | `4eb7dfea1e72fbbcfe2d3aa9af8707bc18d881a6164e5aa32931bcc3aaf2e937` |
| release_manifest.json | `073e9c818fb7e18e2bfc045e8dd426330cd6603cdca6ffd487963eed53924672` |

`python -B code/analysis/verify_distinct_venue_release.py` checked the
review, complete family, exact released fields, source/protocol hashes
and byte-identical CSV/PNG replay. It used the reviewed public summary
only, not the private cells or original datasets, and saved
`verification_receipt.json`. Main visually inspected the graph: both samples,
both control sets and all three years are shown on the same [-1,1] scale;
labels and legend are readable. Small differences require the numerical
table rather than an artificially magnified chart.

Execution versions: Python 3.12.10, NumPy 2.3.5, pandas 3.0.0,
SciPy 1.15.3. Plot/replay used Matplotlib 3.10.8. The released summary
records seven source/protocol/baseline hashes and the exporter hash.

Note 108 reports all 48 correlations and six support records. The new D
correlations after area/category controls range from -0.001651 to 0.002518,
whereas the old B correlations remain approximately 0.12. This materially
narrows the interpretation of the original count pattern. It is not an
identified concentration mechanism, equivalence test, statistical-significance
result or proof against a causal venue-variety effect. Category-only D
correlations remain positive. Original results and all earlier failed gates
remain; the income/common-menu input approval is still separate.

This log establishes local empirical completion, not complete-source delivery
to the Project or a new website publication. Any scoped Space reconciliation
must have its own fresh-guard/readback receipt.
