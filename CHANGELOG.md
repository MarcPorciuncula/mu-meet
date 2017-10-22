## 0.0.10 (Oct 22, 2017)
* A new tabbed layout for the meeting planner screen.
* Add a Pride Codes bar!
* Streamlined picking a date range, just choose this week, next week etc.
* Fix the minute picker

## 0.0.9 (Aug 8, 2017)
* Disable the minute picker in time range control as meeting time finder does not yet take minutes into account.
* Fix issue where minute picker in time range control throws an error.
* Prevent meeting finder from getting stuck in an indeterminate state in the event of an internal server error.

## 0.0.8 (Jul 28, 2017)
* __Actually__ fix issue with auth tokens not being refreshed on the server

## 0.0.7 (Jul 27, 2017)
* Fix issue with auth tokens not being refreshed on the server side resulting in failed cloud functions
* Update the meeting planner ui to make it more obvious what steps to take
* Show the user when their meeting times are stale and that they should recalculate meeting times.

## 0.0.6 (Jul 26, 2017)
* Revert firebase hosting routing rules to default

## 0.0.5 (Jul 25, 2017)
* Make meeting time calculations run faster
* Show progress of meeting time calculations to all users (not just the one who clicked the button)
* Update Material Components Web dependencies
* A few bugfixes and optimisations

## 0.0.4 (Jul 25, 2017)
* Visual improvements to the header bar
* Fallbacks if `IntersectionObserver` is not supported

## 0.0.3 (Jul 24, 2017)
In preparation for first release to Monash students.

wow this release is a big leap since I last updated this changelog :)

* GitLab CI
* Twitter and Facebook metadata for pretty embeds
* Meeting times show in a schedule view for context
* Set meeting parameters (only date and hour range for now)
* Use Material Components Web
* Migrate to Firebase hosting
* Move tons of heavy operations to Cloud Functions
* Authenticate on the server side and hold Google API tokens
* So many little things that I can't remember

## 0.0.2 (May 12, 2017)

Semver is confusing :)
* Changed version to pre 1.x to reflect instability.

## 1.0.1 (April 30, 2017)

* Added link to GitHub project and Marc's GitHub profile.
* Added [babel-plugin-ramda](https://github.com/megawac/babel-plugin-ramda) to reduce bundle size

## 1.0.0 (April 30, 2017)

* Design refresh
* Same features as Unihack version
