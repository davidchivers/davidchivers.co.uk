# Complete national inventory checks

All published geography, including territories, unless explicitly labelled US50/DC. Street-match support is GEOMATCH A, not independent building-coordinate validation.

## Annual support

| FY | All outlets | Candidates | US50/DC candidates | Street-match candidates | Complete address |
|---|---:|---:|---:|---:|---:|
| 2017 | 17,452 | 16,735 | 16,724 | 16,364 | 16,735 |
| 2018 | 17,478 | 16,801 | 16,786 | 16,673 | 16,801 |
| 2019 | 17,496 | 16,812 | 16,796 | 16,719 | 16,812 |

## Key presence, not openings or closures

| Years | Both releases | Earlier only | Later only | Union |
|---|---:|---:|---:|---:|
| 2017-2018 | 17,348 | 104 | 130 | 17,582 |
| 2018-2019 | 17,396 | 82 | 100 | 17,578 |
| 2017-2019 | 17,270 | 182 | 226 | 17,678 |

## Every pair and both samples

| Years | Sample | Keys | Same address | Different address | Unusable address | Coordinates >100m | Coordinates >1km |
|---|---|---:|---:|---:|---:|---:|---:|
| 2017-2018 | all three year keys | 17,267 | 17,059 | 208 | 0 | 353 | 157 |
| 2017-2018 | candidate in all three | 16,603 | 16,411 | 192 | 0 | 323 | 139 |
| 2018-2019 | all three year keys | 17,267 | 17,013 | 254 | 0 | 231 | 105 |
| 2018-2019 | candidate in all three | 16,603 | 16,363 | 240 | 0 | 216 | 93 |
| 2017-2019 | all three year keys | 17,267 | 16,833 | 434 | 0 | 547 | 240 |
| 2017-2019 | candidate in all three | 16,603 | 16,198 | 405 | 0 | 504 | 212 |

## Full distance sensitivity

| Sample / years | >25m | >100m | >250m | >1km | Median metres | 99th percentile metres |
|---|---:|---:|---:|---:|---:|---:|
| all three year keys / 2017-2018 | 2,763 | 353 | 289 | 157 | 5.4 | 845.2 |
| candidate in all three / 2017-2018 | 2,627 | 323 | 263 | 139 | 5.4 | 758.9 |
| all three year keys / 2018-2019 | 269 | 231 | 186 | 105 | 0.0 | 309.7 |
| candidate in all three / 2018-2019 | 253 | 216 | 171 | 93 | 0.0 | 277.8 |
| all three year keys / 2017-2019 | 2,963 | 547 | 439 | 240 | 5.4 | 1696.7 |
| candidate in all three / 2017-2019 | 2,812 | 504 | 400 | 212 | 5.4 | 1493.5 |

## Selected continuity subset: all thresholds

| Maximum span across all three pairs | Outlet keys | Share of initial all-year candidates |
|---|---:|---:|
| At most 25m | 13,671 | 82.34% |
| At most 100m | 15,864 | 95.55% |
| At most 250m | 15,866 | 95.56% |
| At most 1000m | 15,867 | 95.57% |

## Reporting-calendar alignment

| FY | Unit | Rows | Exact calendar | Partial overlap | No overlap | Missing/invalid | Mean overlap, valid |
|---|---|---:|---:|---:|---:|---:|---:|
| 2017 | all systems | 9,245 | 3,645 | 5,271 | 300 | 29 | 70.26% |
| 2017 | candidate outlets | 16,735 | 6,229 | 9,829 | 677 | 0 | 69.16% |
| 2018 | all systems | 9,261 | 3,638 | 5,311 | 299 | 13 | 70.18% |
| 2018 | candidate outlets | 16,801 | 6,229 | 9,893 | 675 | 4 | 69.11% |
| 2019 | all systems | 9,260 | 3,631 | 5,308 | 302 | 19 | 70.14% |
| 2019 | candidate outlets | 16,812 | 6,228 | 9,907 | 677 | 0 | 69.09% |

The complete JSON retains all observed code frequencies, missing/negative operating-field codes, available imputation flags, parent-join checks, address-by-distance cross-tabs, distance quantiles and source hashes. Absent flag columns are null, not zero imputation. These are public-inventory diagnostics, not exposure estimates.
