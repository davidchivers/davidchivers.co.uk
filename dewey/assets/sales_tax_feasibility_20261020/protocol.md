# Sales taxes and mixing: feasibility and identification

20 October 2026. New direction 9; proposed current investigation priority 3.
This is a prospective design assessment, not a registered empirical protocol,
an executed regression or permission to open additional licensed inputs.
The original coauthor proposal and earlier research protocols are unchanged.

## Question and estimands

Do statutory sales-tax changes alter the distribution of recorded visitors
from different home-income neighbourhoods across nearby destinations?
The first substantive outcome is mixing itself, not attitudes and not an
instrumental-variables estimate of the effect of mixing on another outcome.
Both increased and decreased mixing, and informative near-zero estimates,
remain admissible.

There are three distinct objects:

1. Total recorded traffic at destinations on each side of a tax boundary.
2. Differential destination reallocation across origin-income groups.
3. Separation across the complete observed local destination system,
   containing both sides of the boundary and other preselected substitutes.

The second can change without the third changing. A treated venue becoming
more diverse does not establish that the whole market becomes less segregated.
The observed system excludes unrecorded places and online purchases; report
that limitation rather than calling it all consumption.

## Inputs and the quality decision

The existing annual files cannot recover the timing required for this design.
The verified 2019 accounting is useful machinery and a descriptive benchmark,
not a monthly panel. Proposed 2017-2025 coverage is an ambition in the source
proposal, not a certified local dataset. Current archive corruption remains
unresolved and is distinct from integrity of historically executed files.

Before any new row processing, identify an exact provider product/release,
file manifest, calendar span, schema, POI identifier version and processing
permission. Do not splice provider generations or different backfills.
The 20 October catalogue check is metadata-only. Its current
[Weekly Patterns Plus documentation](https://deweydata.readme.io/docs/weekly-patterns-plus-app)
distinguishes estimated home-CBG visitors from visits and describes normalized
fields and historical backfills. It is not necessarily the inherited release.
Legacy shared-polygon guidance must not be applied automatically to Plus,
whose current documentation states that it uses individual POI geofences.
Any discrepancy between schema, documentation and supplied release must be
resolved before construction.

First inventory actual date intervals and partitions, then test duplicate
POI-period keys, overlapping release copies, corrupted/missing partitions,
identifier changes, origin-income matching, unknown home origins, panel
normalization, geographic assignment and reporting/suppression rules.
Count distinct calendar intervals, not contributing files. Venue-disjoint
partitions are not automatically duplicates. No absent origin cell is coded
as zero until its missingness semantics are established.

Permanent changes are the first design. Prefer directly supplied monthly
origin counts only if their release and quality qualify. Otherwise retain
weekly origin weights and prospectively compare a fixed four-week aggregation.
Do not call either sum monthly unique visitors. A weekly visitor may recur
in multiple weeks and multiple venues. Do not infer origin-by-day composition
from separate daily totals and weekly origin margins, or proportionally split
a boundary-crossing week's origins using those unrelated margins.

Tax holidays are deferred: monthly aggregation can dilute a short event,
and weekly origin composition cannot identify who visited on a particular
holiday day. More smoothing is not a generic solution to an unsuitable unit.

Frequency selection must use calendar completeness, reporting support and
pre-event reliability, before inspecting policy-effect estimates. Compare
measurement noise at fixed venue support and fixed group definitions;
mutual information can rise mechanically in sparse samples. Do not treat
scaled estimates as independent observed individuals or apply an iid bias
correction without a justified observation model. Record a stop if a
defensible frequency cannot be established.

## Geography, income and category assignment

Assign each establishment to the historical tax jurisdiction at the event
date, not its county or present-day ZIP. Separate state, county, municipal
and special-district components; confirm which goods/services were taxable.
Hair salons are a hypothesis, not a universally treated category.
Current lookup tools or polygons alone cannot establish historical treatment.

Define border-market boundaries, eligible origins, categories, chain matches
and substitutes using pre-event geography and attributes, not post-event
patronage or favourable outcomes. Across-state travel barriers, bridges,
tolls and urban form can make geographic proximity a poor common-access rule.

Freeze the baseline venue cohort before treatment. Do not require positive
post-event activity or continuous operation: either can select on a policy
response. Distinguish independently documented closure, genuine zero activity,
provider dropout and group-specific suppression. Only established zeros enter
as zero; ambiguous absence remains missing, with coverage and attrition
reported. Do not silently discard markets with adverse post-event support.

Keep baseline-cohort and whole-market objects separate. The baseline cohort
supports an incumbent-venue reallocation estimand, retaining genuine closures
under the stated zero rule. A whole-market measure must also allow entry and
exit within a frozen geographic/category envelope, using an eligibility rule
independent of outcomes. Provider additions are not automatically real entry.
If genuine entry/exit cannot be distinguished sufficiently from coverage
changes, retain the narrower estimand and do not claim a whole-market effect.

Use both comparisons, for different purposes:

- Same-chain, comparable-format pairs offer a narrower product-comparability
  diagnostic. They do not equalize franchise prices, quality, service,
  clientele or location.
- Narrow-category substitutes and other preselected local destinations are
  necessary for market-wide accounting. A chain-only sample changes that
  estimand and must be labelled separately.

Freeze one pre-event ACS income measure and geography for the event window.
Use documented MSA ranks for a qualified metropolitan market, assigning an
origin one rank consistently across destinations. Specify the reference
population, ties, weighting and treatment of outside-MSA origins. Cross-MSA
markets cannot combine differently defined local ranks without an explicit
common reference. National ranks are a separately defined sensitivity.
Neither is personal earnings. The current national accounting uses unweighted
CBG median-household-income ranks and must not be silently relabelled.
Missing origin income is excluded from both numerator and denominator;
report weighted coverage and retain the strict lookup sensitivity.

## Functional forms

Let w_ojt be the eligible recorded origin-CBG weight for origin o, venue j
and period t. For a separately estimated market m, define a fixed baseline
destination set J_m. The conditional origin destination share is:

    s_ojt = w_ojt / sum_{l in J_m} w_olt.

This conditions on recorded, classified destinations inside the chosen market.
It does not measure the probability that a resident leaves home or capture
an online/outside option. Zero denominators are missing, not zero shares.

For a single isolated permanent-change event, the traffic comparison can use:

    Y_jt = venue_FE_j + market_period_FE_mt
           + sum_{k != -1} beta_k * TreatedSide_j * EventTime_kt + error_jt.

The omitted period and anticipation window must be fixed in advance. Y is
one clearly defined traffic object; origin-flow totals and provider visit
totals are not interchangeable. Opposite-side venues are potentially affected
by diversion. Therefore beta is a relative-side reallocation contrast,
not automatically an absolute treatment effect against an unaffected control.

The source proposal's heterogeneous-response equation becomes:

    s_ojt = origin_venue_FE_oj + origin_period_FE_ot + venue_period_FE_jt
            + beta * tau_jt * (rank_o - 0.5) + error_ojt.

Here tau is the applicable tax rate in percentage points, not an unlabelled
mixture of a rate and a post dummy. A one-percentage-point increase changes
the predicted high-minus-low-rank share contrast by beta times the rank gap.
Venue-period effects absorb the main tax effect; this equation identifies
only a differential response if the residual interaction has support.
Origin-period effects do not remove income-specific responses to unobserved
venue-period changes. Test residual variation/connectivity rather than
assuming that a large row count identifies beta.

The initial pilot estimates markets separately. Its linear share regression
weights eligible origin-venue-period observations equally, rather than giving
high-flow observations greater influence. This is an average differential
response among observed eligible cells, not an average person-level response;
missingness can change the represented cells and must be reported. A
pre-event-flow-weighted sensitivity targets a different average and must be
labelled, not selected for significance. Neither scheme authorizes invented
zeros or post-treatment survivor selection.

If markets are subsequently pooled, retain the market index in the share
denominator and observation key. Use s_omjt, origin-market-venue effects,
origin-market-period effects and market-venue-period effects, or first impose
a documented unique market assignment. An overlapping origin-venue pair must
not silently acquire two denominators or rank definitions. Freeze overlap
handling before estimation; any event-level summary gives each qualifying
policy group equal weight, not each recorded row, with dependence handled at
the policy level. Do not count the five Mendocino rate rows as five events.

A high-dimensional PPML conditional mean for w_ojt is a possible count-scale
alternative, with the same fixed effects and interaction. For normalized
noninteger weights it is quasi-likelihood, not a literal count likelihood.
Use an established estimator and report separation/dropped support; do not
manufacture zeros for suppressed records. No choice between estimators will
be based on the most favourable coefficient.

For the market outcome, define p_gjt from the same income-eligible weights,
including both sides and substitutes. Report separately the fixed baseline
cohort and, only where the entry/exit audit qualifies, all eligible venues in
the frozen geographic/category envelope:

    I_mt = sum_{g,j} p_gjt * log(p_gjt / (p_gt * p_jt)).
    N_mt = I_mt / H(G_mt), when H(G_mt) > 0.

Report raw nats, the normalized measure, group shares and coverage together.
Also report a separately labelled fixed-group-margin diagnostic using
pre-event q_g and current p_t(j|g):

    p_star_gjt = q_g * p_t(j|g).

This isolates a change in destination allocation from a change in the mix
of recorded origin groups. It is not the actual current visitor distribution.
Freeze the rank cutpoints and q_g with the pre-event income reference.
If a baseline-positive group loses all observed support, the diagnostic is
undefined; it is not repaired by reweighting the surviving groups.

The market-level policy effect requires external, plausibly unaffected
comparison markets or another justified counterfactual. Market-period fixed
effects would absorb I_mt itself. A candidate event-specific equation is:

    I_mt = market_FE_m + calendar_period_FE_t
           + sum_{k != -1} theta_k * ExposedMarket_m * EventTime_kt + error_mt.

This becomes causal only under an argued counterfactual trend and spillover
assumption. Track flows exiting the defined market where possible; moving
the border radius after results is not robustness.

## Event eligibility and inference

Compile events before consulting mobility responses. For the initial
permanent-change screen, target at least twelve pre- and twelve post-months
within an internally coherent release and outside the pandemic period.
Earlier/later cases lacking that window can remain documented leads but
are not silently mixed into the primary event study.

Do not retain events because their traffic first stage is statistically
significant. This would select on the outcome and could suppress genuine
null policy effects. Assess precision from pre-event variation and report
all prespecified qualifying cases. Similarly, a nonsignificant pretrend
test is not proof of parallel trends.

Document announcement and implementation separately, tax-base changes,
pass-through uncertainty, fiscal packages and concurrent policies. Tax
changes may be endogenous to local conditions. With sufficient events,
use event-specific clean windows and transparent aggregation rather than
an unrestricted heterogeneous staggered TWFE average. Repeated changes and
continuous rates require their own estimand; binary-adoption estimators are
not automatically applicable.

Cluster at the policy-assignment level and account for correlated events.
Millions of venue-origin observations do not create millions of shocks.
With very few independent policies, do not claim conventional inference;
wild bootstrap and randomization inference are not remedies without their
required support or assignment assumptions.

Method references: [Borusyak, Jaravel and Spiess (2024)](https://doi.org/10.1093/restud/rdae007)
on heterogeneous event studies; [Callaway and Sant'Anna](https://arxiv.org/abs/1803.09015)
on explicit multi-period estimands; [Rambachan and Roth](https://asheshrambachan.github.io/assets/files/hpt-draft.pdf)
on sensitivity to departures from parallel trends. These guide the design,
not certify this application.

## Staged delivery and stop rules

1. Complete proposal/equation reading, primary-source overlap check and a
   source-verified public tax-event shortlist. No mobility effects at this stage.
2. Obtain exact manifest-bound licensed inputs and scoped permission.
   Run an outcome-blind temporal quality audit and historical tax-location match.
   Publish only disclosure-reviewed diagnostics; preserve exclusions and failures.
3. Freeze the markets, frequency, group definition, primary outcomes,
   missingness/disclosure rules and uncertainty procedure. Independently review
   the construction and generate a pre-event precision assessment.
4. Run the complete qualifying family once, report traffic, differential
   reallocation and market mixing including nulls, and distinguish all
   descriptive diagnostics from identification claims.

Continue public feasibility now. Do not run new weekly files, reconstruct
2017-2025 coverage, reinterpret existing annual results as a tax experiment,
or use taxes as an attitudes instrument under the current approval.
Taxes can affect purchasing power, public services and attitudes directly;
a downstream IV exclusion restriction would require a separate argument.
