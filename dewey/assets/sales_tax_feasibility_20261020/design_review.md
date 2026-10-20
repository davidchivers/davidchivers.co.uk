# Independent sales-tax design review

20 October 2026. Bounded review of only the named feasibility protocol and
California registry, with DATA_POLICY checked for permission consistency.
No mobility data, new literature sweep, empirical execution or edits to the
reviewed files or previous literature note. Main integrator retains judgment.

## Findings

**No blocking finding for continued public feasibility work. This is not
clearance to estimate or a certification of identification.** Three refinements
should be resolved before freezing an executable protocol:

1. **[P2] Make fixed-support rules explicitly robust to post-treatment
   selection.** Protocol lines 49-75, 85-108 and 112-120 require quality checks
   and a fixed destination set, but do not yet specify the handling of venue
   closure, genuine zero activity, provider dropout and group-specific
   suppression. Requiring positive observations or continuous operation
   throughout the post-period could condition on policy responses even without
   selecting significant effects. Freeze the pre-event eligible cohort; specify
   which independently established absences are zeros versus missing, report
   attrition/coverage, and label any incumbent-only estimand. Do not manufacture
   zeros or silently drop markets with adverse post-event support.

2. **[P2, conditional on pooling] Index market-specific shares and fix regression
   weights.** Protocol lines 112-152 define shares using J_m but suppress m in
   the regression. This is coherent for separately estimated markets. If an
   origin or origin-venue pair appears in overlapping markets, its denominator
   and possibly rank reference differ: specify market-indexed observations and
   appropriate origin-market-period effects, or impose a documented unique
   assignment. Prespecify how duplicated exposure, market/event aggregation and
   regression weights are handled. Equal origin-venue weighting and flow
   weighting target different averages. This is a specification requirement,
   not evidence that the displayed single-market equation is unidentified.

3. **[P3] Preserve component histories alongside net rate changes.** Registry
   lines 16-21 already acknowledge missing policy histories. Before treating
   cases as simple permanent changes, encode the Larkspur/Vacaville extensions
   and La Mirada's simultaneous city-tax expiration and 0.25-point Measure H
   activation. The latter's net decline remains correctly recorded as 0.75
   points. These qualifications are in the [L-533 footnotes](https://cdtfa.ca.gov/formspubs/l533.pdf),
   not new events discovered through mobility outcomes.

## Checks passed at this stage

- **Fixed effects and identification:** protocol lines 124-145 correctly make
  the traffic coefficient a relative-side contrast and absorb the main tax
  effect with venue-period effects in the heterogeneous equation. The rank-tax
  interaction requires differential tax changes across destinations and rank
  support after absorption; a uniform within-market change cannot supply that
  variation. The text already requires residual-support checks and acknowledges
  income-specific omitted venue shocks. FE saturation alone is not causal
  identification.
- **Venue versus market/spillovers:** lines 90-97 and 154-180 correctly separate
  chain-pair diagnostics from the full preselected destination system, require
  external counterfactual markets for market mixing, and avoid market-period
  effects that would absorb the market outcome. Opposite-side diversion is not
  an untreated-control assumption. Actual and fixed-group-margin distributions
  are distinguished; the latter is undefined after complete group-support loss.
- **Income and selection:** lines 99-108 freeze the pre-event income/geography
  reference, distinguish MSA/national ranks and exclude unmatched income from
  numerator and denominator. Freeze group cutpoints and q_g with that reference.
  Lines 184-194 reject significant-first-stage gates and pretrend-test clearance;
  lines 223-228 retain nulls. Finding 1 concerns an additional sample-selection
  route, not a detected significance gate.
- **Frequency and permission:** lines 31-75 and 218-234 correctly distinguish
  annual accounting from an unverified finer-frequency panel, reject inferred
  daily origins and repeated weekly visitors as monthly uniques, and require
  manifest-bound permission. The registry's false integrity, processing and
  sample-freeze flags are appropriate for this proposed cohort. Existing
  bounded 2019 permissions do not authorize this weekly tax analysis. No claim
  of checked mobility or executed causal estimates was found. Historical
  execution/archive-integrity assertions were not independently re-audited.

## Registry verification

Compared all 15 jurisdiction names, county labels and old/new rate pairs with
[L-533, p. 1](https://cdtfa.ca.gov/formspubs/l533.pdf) and the body of the
[14 March 2018 official release](https://www.cdtfa.ca.gov/news/18-13.htm).
All match; arithmetic checks found zero delta errors. The release's body,
rather than its misleading browser/search title, identifies the rate notice.

The eight city-increase rows, five Mendocino county-policy rate rows and two
city-decrease rows are correctly retained. All five Mendocino rows share one
policy group: 15 rate rows yield **11 provisional groups, not independently
verified shocks**. Group dependence and legislative details remain unresolved.
No-rate-change extensions are excluded as treatments, not certified controls.

Effective date 2018-04-01 is consistent across both sources. The registry's
2017-04-01 start and exclusive 2019-04-01 end give exactly 12 pre- and 12
post-calendar months within nominal 2017-2019. This verifies date arithmetic,
not available monthly/weekly observations. Historical boundaries, taxability,
counterpart rates and mobility coverage remain unchecked. The stored public
PDF hash was not independently recomputed in this bounded review.

## Reviewed snapshots

Line references refer to these read-only snapshots; subsequent integration may
change line numbers. SHA-256:

- `docs/protocols/sales_tax_mixing_feasibility_20261020.md`:
  `063f6bdf5c528ee7dd0c56133fa2d9178b8c1da150ed1f8f7c42ed10001ebafe`
- `output/sales_tax_feasibility_20261020/ca_april2018_policy_registry.json`:
  `58577c47246c78d77bc09e89e19a98a91ff8e1973c9cf323381d403f1116e4cf`
