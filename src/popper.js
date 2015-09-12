(function ($) {
  var CONTAINER_CLASS = 'popper-container',
      SECONDARY_CLASS = 'secondary-popper',
      PRIMARY_CLASS = 'primary-popper',
      ACTIVE_CLASS = 'popped',
      DEFAULT_OPTIONS = {
        transitionOutDuration: 450,
        transitionInDuration: 450,
        transitionOutDelay: 50,
        transitionInDelay: 50,
        transitionOutEasing: 'easeOutBack',
        transitionInEasing: 'easeInBack'
      },
      ANIMATION_PRESETS = {
        spiral: {
          transitionOutDuration: 450,
          transitionInDuration: 450,
          transitionOutDelay: 50,
          transitionInDelay: 50,
          transitionOutEasing: 'easeOutBack',
          transitionInEasing: 'easeInBack'
        },
        pop: {
          transitionOutDuration: 450,
          transitionInDuration: 450,
          transitionOutDelay: 0,
          transitionInDelay: 0,
          transitionOutEasing: 'easeOutBack',
          transitionInEasing: 'easeInBack'
        }
      };

  function Popper (element, options) {
    this.element = $(element);
    this.primary = this.element.find('[data-primary]');
    this.poppers = this.element.find(':not([data-primary])');
    this.options = $.extend({}, DEFAULT_OPTIONS, options || {});

    this.primary.on('click', this.primaryClicked.bind(this));
    this.element.addClass(CONTAINER_CLASS);
    this.poppers.addClass(SECONDARY_CLASS);
    this.primary.addClass(PRIMARY_CLASS);
    this.hidePoppers(true);
  }

  Popper.prototype.getPoppersStartingPosition = function () {
    return {
      left: Math.abs(this.primary.position().left + (this.primary.width()/2)),
      top: Math.abs(this.primary.position().top + (this.primary.height()/2))
    };
  };

  Popper.prototype.getTransitionRules = function () {
    if (this.options.animation && this.options.animation in ANIMATION_PRESETS) {
      return ANIMATION_PRESETS[this.options.animation];
    } else {
      return this.options;
    }
  };

  Popper.prototype.hidePoppers = function (noAnimation) {
    var position = this.getPoppersStartingPosition(),
        transition = this.getTransitionRules();

    if (noAnimation) {
      this.poppers.each(function () {
        $(this).css({
          left: position.left - ($(this).width() / 2),
          top: position.top - ($(this).height()/2)
        });
      });
    } else {
      this.poppers.each(function (index, item) {
        $(item).stop().delay(index * transition.transitionInDelay).animate({
          left: position.left - ($(item).width() / 2),
          top: position.top - ($(item).width()/2)
        }, {
          duration: transition.transitionInDuration,
          easing: transition.transitionInEasing,
        });
      }.bind(this));
    }
    this.element.removeClass(ACTIVE_CLASS);
  };

  Popper.prototype.showPoppers = function () {
    this.element.addClass(ACTIVE_CLASS);
    this.poppers.show();
    this.positionPoppers();
  };

  Popper.prototype.positionPoppers = function () {
    var radius = 100,
        angle = 0,
        step = (2 * Math.PI) / this.poppers.length,
        transition = this.getTransitionRules(),
        position = this.getPoppersStartingPosition(),
        elementW = this.element.width(),
        elementH = this.element.height();

    this.poppers.each(function (index, item) {
      var width = $(item).width(),
          height = $(item).height(),
          deltaWidth = (elementW / 2) - ($(item).width() / 2),
          deltaHeight = (elementH / 2) - ($(item).height() / 2),
          x = Math.round(width + radius * Math.cos(angle) - deltaWidth/2),
          y = Math.round(height + radius * Math.sin(angle) - deltaHeight/2);


      $(item).delay(index * transition.transitionOutDelay).animate({
        left: x + 'px',
        top: y + 'px'
      }, {
        duration: transition.transitionOutDuration,
        easing: transition.transitionOutEasing
      });
      angle += step;
    }.bind(this));
  };

  Popper.prototype.primaryClicked = function () {
    if (this.element.hasClass('popped')) {
      this.hidePoppers();
    } else {
      this.showPoppers();
    }
    return false;
  };


  $.fn.popper = function (options) {
    return this.each(function () {
      var popper = new Popper(this, options);
      $(this).data('popper', popper);
    });
  };
})(jQuery);
