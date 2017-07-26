angular.module('seed.directives')
  .directive('dateRangePicker', ['$document', '$timeout', function dateRangePicker($document, $timeout) {
    return {
      restrict: 'E',
      scope: {
        start: '=',
        end: '=',
        presets: '=?',
        timerEnabled: '=',
        onChange: '&?',
        onChangeStart: '&?',
        onChangeEnd: '&?',
        onClose: '&?',
      },
      replace: true,
      templateUrl: './dateRangePicker.html',
      compile() {
        return {
          pre: function preLink() {},
          post: function postLink(scope, element) {
            scope.calendarActive = true;

            // Get current date
            scope.current = moment();

            // Convert start datetime to moment.js if its not a moment object yet
            if (scope.start && !scope.start._isAMomentObject) {
              scope.start = moment(scope.start);
            }

            // Convert end datetime to moment.js if its not a moment object yet
            if (scope.end && !scope.end._isAMomentObject) {
              scope.end = moment(scope.end);
            }

            // Get number of weeks in month
            scope.getNumWeeks = function getNumWeeks() {
              if (!scope.calendar) { return 0; }

              const firstDayOfWeek = scope.calendar.clone()
                .startOf('week')
                .weekday();

              const firstOfMonth = scope.calendar.clone()
                .startOf('month');
              // const lastOfMonth = scope.calendar.clone()
              //   .endOf('month');

              const firstWeekDay = ((firstOfMonth.weekday() - firstDayOfWeek) + 7) % 7;

              return Math.ceil((firstWeekDay + scope.calendar.daysInMonth()) / 7);
            };

            // Set selected date
            scope.selectDate = function selectDate(_date, _str) {
              let date = _date;
              const str = _str;

              if (!date) {
                scope[str] = moment();
                date = scope[str];
              }
              if (scope.selected === date) {
                // scope.selected = undefined;
                scope.close();
              } else {
                scope.selected = date;
                scope.calendar = scope.selected.clone();
                scope.presetsActive = false;
              }
            };

            // Update selected date
            scope.setDate = function setDate(date, calendarUpdate) {
              if (scope.selected.isSame(date)) { return; }

              if ((scope.selected === scope.start && (date < scope.end || !scope.end)) || (scope.selected === scope.end && (date > scope.start || !scope.start))) {
                scope.selected.year(date.year())
                  .month(date.month())
                  .date(date.date())
                  .hours(date.hours())
                  .minutes(date.minutes())
                  .seconds(date.seconds());
                if ((scope.selected.clone()
                    .startOf('week')
                    .month() !== scope.calendar.month() && scope.selected.clone()
                    .endOf('week')
                    .month() !== scope.calendar.month()) || calendarUpdate) {
                  scope.calendar = scope.selected.clone();
                }
                if (scope.selected === scope.start) {
                  scope.callbackStart();
                }
                if (scope.selected === scope.end) {
                  scope.callbackEnd();
                }
                scope.callbackAll();
              } else {
                // console.log('warning');
                scope.warning = (scope.selected === scope.start) ? 'end' : 'start';
                $timeout(() => {
                  scope.warning = undefined;
                }, 250);
              }
            };

            // Set start and end datetime objects to the selected preset
            scope.selectPreset = function selectPreset(preset) {
              if (!scope.start) {
                scope.start = moment();
              }

              if (!scope.end) {
                scope.end = moment();
              }

              // Don't do anything if nothing is changed
              if (scope.start.isSame(preset.start) && scope.end.isSame(preset.end)) { return; }

              // Update start datetime object if changed
              if (!scope.start.isSame(preset.start)) {
                if (preset.start) {
                  scope.start = preset.start.clone();
                } else {
                  scope.start = undefined;
                }

                scope.callbackStart();
              }

              // Update end datetime object if changed
              if (!scope.end.isSame(preset.end)) {
                if (preset.end) {
                  scope.end = preset.end.clone();
                } else {
                  scope.end = undefined;
                }

                scope.callbackEnd();
              }

              // Something has definitely changed, fire ambiguous callback
              scope.callbackAll();

              // Hide presets menu on select
              $timeout(() => {
                scope.close();
              });
            };

            // Callbacks fired on change of start datetime object
            scope.callbackStart = function callbackStart() {
              if (scope.onChangeStart) {
                $timeout(() => {
                  scope.onChangeStart();
                });
              }
            };

            // Callbacks fired on change of end datetime object
            scope.callbackEnd = function callbackEnd() {
              if (scope.onChangeEnd) {
                $timeout(() => {
                  scope.onChangeEnd();
                });
              }
            };

            // Callbacks fired on change of start and/or end datetime objects
            scope.callbackAll = function callbackAll() {
              if (scope.onChange) {
                $timeout(() => {
                  scope.onChange();
                });
              }
            };

            // Close edit popover
            scope.close = function close() {
              scope.selected = '';
              scope.presetsActive = false;
              // scope.calendarActive = false;

              if (scope.onClose) {
                scope.onClose();
              }
            };

            // Bind click events outside directive to close edit popover
            $document.on('mousedown', (e) => {
              if (!element[0].contains(e.target) && (!!scope.presetsActive || !!scope.selected)) {
                scope.$apply(() => {
                  scope.close();
                });
              }
            });

            // Bind 'esc' keyup event to close edit popover
            $document.on('keyup', (e) => {
              if (e.keyCode === 27 && (!!scope.presetsActive || !!scope.selected)) {
                scope.$apply(() => {
                  scope.close();
                });
              }
            });
          }
        };
      }
    };
  }]);

// Scroll up directive
angular.module('seed.directives')
  .directive('scrollUp', () => ({
    restrict: 'A',
    compile() {
      return {
        pre: function preLink() {},
        post: function postLink(scope, element, attrs) {
          element.bind('mousewheel wheel', (_ev) => {
            const ev = _ev.originalEvent || _ev;
            const delta = ev.wheelDelta || (-1 * ev.deltaY) || 0;
            if (delta > 0) {
              scope.$apply(() => {
                scope.$eval(attrs.scrollUp);
              });
              ev.preventDefault();
            }
          });
        }
      };
    }
  }));

// Scroll down directive
angular.module('seed.directives')
  .directive('scrollDown', () => ({
    restrict: 'A',
    compile() {
      return {
        pre: function preLink() {},
        post: function postLink(scope, element, attrs) {
          element.bind('mousewheel wheel', (_ev) => {
            const ev = _ev.originalEvent || _ev;
            const delta = ev.wheelDelta || (-1 * ev.deltaY) || 0;
            if (delta < 0) {
              scope.$apply(() => {
                scope.$eval(attrs.scrollDown);
              });
              ev.preventDefault();
            }
          });
        }
      };
    }
  }));
