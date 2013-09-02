(function(){
    Function.prototype.debounce = function debounce(delay) {
        var timer = null, fn = this;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    };
    Function.prototype.throttle = function throttle(threshhold, scope) {
        threshhold || (threshhold = 250);
        var last,
            deferTimer,
            fn = this;
        return function () {
            var context = scope || this;

            var now = +new Date,
                args = arguments;
            if (last && now < last + threshhold) {
                // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function () {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    }

}());