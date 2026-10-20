# Within-service income accounting: construction and validation record

20 October 2026. Staged-input-reproducible conditional on licensed access to
the pinned derived release. The empirical category calculation completed;
the proposed joint category/concentration release is withheld. Independent
verification now confirms that stop. No category outcome
has been read into model context or published.

## Purpose and unit

Determine whether note 117's within-county/subcategory income separation is
widespread across service labels or concentrated in a few services. The
calculation uses each eligible 2019 venue/lookup vector, then literal
`SUB_CATEGORY` summaries. It does not collapse to a top-150 workforce bridge.
Full-Service Restaurants is the preselected example from note 101; it was
not chosen after viewing category outcomes.

For each category, total between-venue information is decomposed into
between-county and within-county information. All three are normalized by
that category/lookup's pooled income entropy. The within share divides within
information by total information. A high share is not necessarily large
absolute separation. The two lookups have different classification/support.

## Authorized inputs and identities

David's explicit full-2019 permission covers category/county/venue accounting
from the three named derived source files. This follow-up reuses the
previously verified ten-group venue vectors instead of repeating the
40-minute source reconstruction. No original weekly archive, coordinates,
new year, worker file or attitude record is read.

The private source folder is the existing full-income `run_01` in the
approved spillover execution storage. Its configuration remains private.
Exact reused file identities are:

| Private artifact | SHA-256 |
|---|---|
| private_venue_mass.parquet | f10368f1da580a5e6a1b43ac582744fbb7899cfe60f7d890ca8e7f9f30633417 |
| private_accounting.json | 4423259ddf22ec54accc1734b39d62bf2644f59066d793bc4d70f0a01017b00a |
| private_execution_receipt.json | 789d24ed1655a1839221f63645ff365d6b2ce7bb9622215e1d24b199373bf2c4 |
| verification_income_full.json | eb097be70c38d9bb7a3133c1e0e84acf2f0f3dcbdbf99ffb6f3c8cdd8d377dc3 |

The vector file is 267,405,764 bytes. Its provenance remains the 2015-2019
ACS five-year wave, harmonized 2020 home-CBG lookup, ten national unweighted
CBG median-household-income rank groups and recorded annual origin-flow
weights. Missing income is excluded without imputation. National support
requires known recorded county/subcategory and positive classified mass;
missing MSA does not exclude a venue. See complete construction log 117 for
the original approved sources, exclusion ledger and source reconciliation.

Detailed vectors were processed locally, read-only. No row samples, venue
identifiers, group distributions, private category/county values or private
configuration were displayed, uploaded or committed.

## Prospective decisions and code review

The original follow-up protocol is
`docs/protocols/income_category_accounting_2019_20261020.md`. It was written
after the national result but before any category outcome, so this is a
post-national-result descriptive follow-up, not a preregistered primary test.
Its source text is preserved.

The separate pre-execution safeguard addendum
`docs/protocols/income_category_accounting_safeguards_20261020.md` records
fixes prompted by artificial review, not empirical outcomes:

- Nonnegative stable relative-entropy arithmetic prevents cancellation near
  the unchanged 1e-12-nat denominator floor. Direct total, entropy-difference
  and chain checks precede reporting coherent `T=B+W`.
- A standard-library 80-digit Decimal reference is independent of the
  scalable SQL series. Artificial grid, invariance and exact-reproducer
  tests check both against a separate 100-digit entropy oracle.
- Boolean atoms of eligible categories and four top-five selections screen
  intersections, complements and differences, including paired lookup support.
  A synthetic singleton complement previously escaped union-only checks.
- Positive concentration underflow fails rather than becoming substantive
  zero. Public fields and summaries are rounded to six decimal places.
- Private paths are rejected beneath any Git directory/worktree marker,
  not only this checkout. The actual run uses approved spillover storage.

The complete artificial reviews, original findings, corrective review and
source identities are retained in
`workstreams/income_category_reference_20261020.md` and
`workstreams/income_category_numeric_fix_20261020.md`.
The integrated preflight ran 55 tests, with zero errors/failures, and its
execution fingerprints matched the launch manifest exactly. Three separate
synthetic rendering tests subsequently passed; they are not empirical figures.

## Execution

The new runner is `code/analysis/run_income_category_accounting_2019.py`.
The frozen launch manifest SHA-256 is
`c82ae06a37badeecf1e794eaf3ba1a2be673609173b9f9287be0d27d42ed4084`.
It binds the private configuration, four source artifacts, nine execution
modules and three protocol files. The original national execution sources
are also checked against the prior successful receipt and left unchanged.

One empirical run completed in **105.402657 seconds**. It used two DuckDB
threads, a 2 GB engine limit and private disk scratch; the limit is not an
operating-system memory guarantee. The runner:

1. Verified all input hashes, original execution fingerprints and the prior
   completed producer/independent-verifier receipts.
2. Validated schema, duplicate keys, finite positive masses, category resource
   caps and normalization; no failed category is silently dropped.
3. Calculated all literal-category results for both retained lookup universes.
4. Reconciled weighted category entropy/information to the existing national
   accounting, including categories not eligible for public release.
5. Selected the fixed full-SHA256-ID modulo-1,000 sample and independently
   compared exact keys/counts, masses and arithmetic fields. The fixed sample
   remains private and is not used for population estimates.
6. Evaluated individual, pooled, Boolean-atom and paired-atom support screens.
7. Rehashed all inputs, configuration, launch and execution files.

No Hamilton job or duplicate full reconstruction was submitted. The full
calculation and independent sample pass. Maximum national-reconciliation
error and maximum independent-reference field error are each
`4.440892098500626e-16`. Input and execution identities are unchanged.

## Release outcome

The proposed initial joint release **fails** its prospectively fixed paired
query-atom support rule. The pooled union/withheld-remainder and unpaired
Boolean-atom venue/county/dominance screens pass. At least one query-generated
atom has a nonempty lookup-only remainder below 20 venues. Do not publish
the affected label, atom membership, exact remainder count or detailed outcomes.
This is a conservative disclosure stop, not a negative economic estimate
or evidence that the accounting arithmetic failed.

The runner does not create `category_candidate_pending_review.json`.
Consequently no real all-category CSV, graph, category percentile,
concentration statistic or restaurant estimate has been released. The
renderer exists and passes artificial tests but has not rendered real results.
The original 52.09% preferred and 54.32% strict national residual shares remain
the earlier separately approved result, not new category estimates.

Private retained outputs include category accounting, fixed-sample comparison,
disclosure screens, selected sample, launch/configuration and execution
receipt. None is an authorized public data release. Coarse diagnostic status
can be reviewed separately without exposing category outcomes.

## Independent stop verification

The separate verifier `verify_income_category_release_stop.py` imports no
production accounting or disclosure module. Its independently implemented
full outer join reconstructs lookup membership, category support, the four
top-five selections, all query-atom memberships and their pooled/paired
support. It compares those with the private artifacts and endorses only
the specific below-20 lookup-only failure; any discrepancy or another
failure is rejected. This is not an independent rerun of entropy accounting.

All 19 artificial verifier tests passed locally in 8.667 seconds. The pinned
invocation wrapper `run_income_category_release_stop_2019.py` then completed
the real check in 12.493579 seconds at 17:52:34 UTC. It rechecked the original
four derived artifact hashes, frozen launch/configuration and production
code, category-run artifacts and verifier sources before and after execution.
All watched hashes are unchanged. The run directory still has no category
candidate. Detailed diagnostic objects were not printed or serialized.

The private verification receipt SHA-256 is
`121cea8c1009c371f4a799e00cd989f58ce40b21b99de789c4f71d482bf2fc3b`.
Verifier and invocation-wrapper SHA-256 values are respectively
`55ee89149644f3345c3224a25b30c16293c16c83c1071a914e2e5f4206149cb4`
and `7803932f1a7fce5742e5324ca255e7f2e4c9f99aea58313af70615022ce78937`.
The integrator reviewed the fixed coarse return and explicit technical
receipt fields; no labels, exact support counts, selections or economic
category outcomes enter the safe record at
`output/income_category_accounting_2019/release_stop_verification.json`.
The full synthetic handoff is in
`workstreams/income_category_stop_review_20261020.md`.

## Reproduction

Use the existing Python 3.12 environment recorded by the private receipt.
From `code/analysis`, run the named numeric/reference/disclosure/runner tests
against artificial data. For a licensed, authorized rerun, create a NEW private
output directory in a separate configuration; preserve this run and all pins:

```powershell
python -B run_income_category_accounting_2019.py --config PRIVATE_CONFIG --launch NEW_PRIVATE_LAUNCH --prepare
python -B run_income_category_accounting_2019.py --config PRIVATE_CONFIG --launch NEW_PRIVATE_LAUNCH
```

The runner refuses changed source identities, changed frozen execution,
existing/nested output targets and paths inside Git. It prints only phase
and coarse status information; detailed results remain private. Reproduction
requires the named licensed artifacts, not just this repository. Preparing a
manifest does not establish execution or release eligibility.

To recheck the retained stop without rerunning the accounting:

```powershell
python -B -m unittest -v test_income_category_release_stop.py
python -B run_income_category_release_stop_2019.py --source VERIFIED_FULL_RUN_DIRECTORY --run-root CATEGORY_RUN_ROOT
```

The invocation preserves its receipt and refuses to overwrite it. A repeat
requires an explicit new receipt destination in a separately reviewed
invocation; do not delete this evidence to make the command run again.

## Limits and next decision

This check does not certify original weekly completeness, calendar-partition
handling, production-version linkage, raw-archive integrity, personal income,
observed encounters or common opportunity sets. Unknown raw-corruption year
coverage remains unresolved. Correction 70a, the negative equal-county
validation, expected-versus-observed-worker distinction and failed attitude
families are unchanged.

Preserve the full private result and the failed gate. Do not loosen thresholds,
switch benchmarks, reveal a successful subset or treat withheld values as zero.
The stop is independently reproduced. Continue the
already authorized finer-geography sequence with coordinate qualification and
prospectively fixed areas. Any later redesign of the release format needs an
explicit separate rationale and review; it is not the original release.
