/**
 *  Copyright (c) 2023
 *  @Version    : 1.0.0
 *  @Repository : https://github.com/salarizadi/jquery-audio
 *  @Author     : https://salarizadi.github.io
 *
 *
 *  1. Add element
 *  <div class="audio my-audio"></div>
 *
 *  2. Initialization
 *  $(".my-audio").Audio({
 *     audio      : `audio link`,
 *     blob       : true, // false
 *     timeupdate : function ( time ) {
 *         console.log("Updated time audio ", this, time)
 *     },
 *     success : function () {
 *         console.log("The audio is loaded", this)
 *     },
 *     error   : function ( err ) {
 *         console.error("The audio is aborted", this, err)
 *     },
 *     play    : function () {
 *         console.log("The audio is playing", this)
 *     },
 *     pause   : function () {
 *         console.log("The audio is paused", this)
 *     },
 *     ended   : function () {
 *         console.log("The audio is ended", this)
 *     }
 * })
 */

(function ($) {
    if ($) {
        let Audios = [];

        $.fn.Audio = function (options ) {
            options = $.extend(true, {
                timeupdate : time => {},
                loading    : ( ) => {},
                success    : ( ) => {},
                error      : err => {},
                play       : ( ) => {},
                pause      : ( ) => {},
                ended      : ( ) => {},
                blob       : false,
                iconPlay   : `<svg class="play" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(0 512) scale(.1 -.1)">
                    <path d="m620 5110c-71-15-151-60-206-115-86-85-137-210-154-375-13-129-13-3991 0-4120 17-165 68-290 154-375 149-149 373-163 619-39 76 37 3457 1975 3546 2031 31 20 90 70 131 112 159 161 196 340 107 521-37 76-152 198-238 253-89 56-3470 1994-3546 2031-37 19-97 44-133 56-74 24-214 34-280 20z"/>
                    </g></svg>`,
                iconPause  : `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(0 512) scale(.1 -.1)">
                    <path d="m1076 5104c-253-57-445-229-533-479l-28-80v-1985-1985l28-80c111-316 400-513 723-492 180 12 325 79 460 212 64 64 90 98 126 172 90 179 83-7 83 2173s7 1994-83 2173c-81 163-239 296-417 353-104 33-259 41-359 18z"/>
                    <path d="m3774 5110c-143-26-265-92-380-205-64-64-89-98-126-172-90-179-83 7-83-2173s-7-1994 83-2173c81-163 237-295 417-354 68-22 98-26 205-27 141-1 211 14 321 68 174 86 298 228 366 421l28 80v1985 1985l-28 80c-84 236-262 407-492 470-72 19-240 27-311 15z"/>
                    </g></svg>`,
                iconLoader : `<svg class="rotating" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(0 512) scale(.1 -.1)">
                <path d="m4022 4748c-183-20-332-166-363-354-23-138 21-267 133-389 311-341 458-703 458-1123-1-746-509-1409-1219-1593-619-160-1267 17-1697 463-436 453-578 1110-368 1700 62 174 180 365 350 568 133 159 147 360 36 528-78 119-201 182-357 183-144 1-252-54-368-189-329-376-531-814-604-1306-24-158-23-512 0-666 148-960 754-1715 1642-2045 435-162 975-201 1455-105 729 147 1351 616 1699 1282 144 274 230 538 277 848 25 162 25 512 1 670-82 532-306 991-666 1366-134 138-242 181-409 162z"/>
                </g></svg>`,
                iconX      : `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(0 512) scale(.1 -.1)">
                <path d="m460 5104c-140-30-271-121-357-246-121-178-134-399-36-598 35-72 71-110 847-887l811-813-811-812c-776-778-812-816-847-888-135-274-54-587 195-757 178-121 399-134 598-36 72 35 110 71 888 847l812 811 813-811c777-776 815-812 887-847 196-97 417-85 594 33 253 170 335 484 199 760-35 72-71 110-847 888l-811 812 811 813c776 777 812 815 847 887 135 274 54 587-195 757-178 120-397 134-598 37-72-35-105-66-887-848l-813-811-812 811c-778 776-816 812-888 847-128 63-264 81-400 51z"/>
                </g></svg>`,
                iconDL     : `<svg class="download" viewBox="20 6 65 45" xmlns="http://www.w3.org/2000/svg">
                <path class="arrow" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M31.999 9v20M24.929 26.93l7.07 7.07M39.07 26.93L31.999 34"></path>
                <path class="disk" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M16 44h32"/>
                </svg>`
            }, options);

            const $Audio = {
                id      : "audio-" + Math.floor(Math.random() * 999999) + "-" + Math.floor(Math.random() * 999999),
                node    : $(this),
                range   : $(`<input type="range" value="0" min="0" step="1" disabled>`),
                button  : $(`<button class="play">${options.iconPlay}</button>`),
                time    : $(`<span>00:00</span>`),
                playing : false,
                blob    : false,
                play    : function () {
                    if ( this.playing ) return true;
                    return new Promise((resolve, reject) => {
                        try {
                            this.pauseAll();

                            this.audio.play();

                            this.button.removeClass("play");

                            this.button.html(options.iconPause);
                            this.range.removeAttr("disabled");

                            resolve(true);
                        } catch (e) {reject(e)}
                    }).then(value => this.playing = true, options.play.bind(this)()).catch(reason => {})
                },
                pause   : function ( disabled_range = true ) {
                    if ( !this.playing ) return true;
                    return new Promise((resolve, reject) => {
                        try {
                            this.audio.pause();

                            this.button.addClass("play");

                            this.button.html(options.iconPlay);

                            if ( disabled_range ) {
                                this.range.attr("disabled", true)
                            } else {
                                this.range.removeAttr("disabled")
                            }

                            resolve(true);
                        } catch (e) {reject(e)}
                    }).then(value => this.playing = false, options.pause.bind(this)()).catch(reason => {})
                },
                pauseAll: range => $.each(Audios, (k, v) => v.playing ? v.pause.bind(v)(range) : ""),
                options : options
            };

            try {
                if ( typeof options.audio !== "string" )
                    throw "$.Audio : audio not found, please enter the url audio";

                if ( !options.blob )
                    $Audio.audio = new Audio(options.audio);

                $Audio.node.attr("id", $Audio.id);

                // Range audio
                const Range = {
                    init ( ) {
                        this.update(0);
                        this.events();

                        $Audio.node.append($Audio.range);
                    },
                    update ( value ) {
                        const duration = $Audio.duration ?? 0;
                        $Audio.range.val(value);
                        this.addRule(`.audio#${$Audio.id} input[type=range]:before`, {
                            width: ((value + 20) / duration * 100) + "px"
                        });
                    },
                    events ( ) {
                        $Audio.range.bind("input", function (e) {
                            const val = Number($(this).val());
                            $(this).data("prev-val", val);
                            $Audio.pause(false);
                            Range.update(val);
                        });

                        $Audio.range.bind("change", function () {
                            const val = Number($(this).val()) / $Audio.audio.duration * 100;
                            if ( val !== Number($(this).data("prev-val")) || val === 0 ) {
                                const pct = val / 100;
                                $Audio.audio.currentTime = ($Audio.audio.duration || 0) * pct;
                                $(this).data("prev-val", -1);
                                $Audio.play();
                            }
                        });
                    },
                    addRule ( selector, styles, sheet ) {
                        styles = (function (styles) {
                            if (typeof styles === "string") return styles;
                            let clone = "";
                            for (let p in styles) {
                                if (styles.hasOwnProperty(p)) {
                                    let val = styles[p];
                                    p = p.replace(/([A-Z])/g, "-$1").toLowerCase(); // convert to dash-case
                                    clone += p + ":" + (p === "content" ? '"' + val + '"' : val) + "; ";
                                }
                            }
                            return clone;
                        }(styles));
                        sheet = sheet || document.styleSheets[document.styleSheets.length - 1];
                        if (sheet.insertRule) sheet.insertRule(selector + " {" + styles + "}", sheet.cssRules.length);
                        else if (sheet.addRule) sheet.addRule(selector, styles);
                        return this;
                    }
                };
                // END Range audio

                const fullTime = function ( time ) {
                    if ( time === Infinity || isNaN(time) ) return "00:00";

                    time = Math.floor(time);

                    const minutes = Math.floor(time / 60);
                    const seconds = time - minutes * 60;

                    function str_pad_left ( string, pad, length ) {
                        return (new Array(length + 1).join(pad) + string).slice(-length);
                    }

                    return str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
                };

                function defaultERROR ( error ) {
                    $Audio.button.html(options.iconX);
                    $Audio.range.attr("disabled", true);
                    options.error.bind($Audio)(error);
                }

                // Audio events
                function audioEvents ( ) {
                    $Audio.button.html(options.iconLoader);
                    $Audio.button.find("svg").addClass("rotating");
                    options.loading.bind($Audio)();

                    $Audio.audio.addEventListener("loadeddata", () => {
                        $Audio.duration = $Audio.audio.duration;

                        $Audio.range.attr("max", $Audio.audio.duration);
                        $Audio.time.html(fullTime($Audio.audio.duration));

                        $Audio.button.addClass("play");
                        $Audio.button.html(options.iconPlay);
                        $Audio.range.attr("disabled", true);

                        $Audio.button.click(function () {
                            $(this).trigger("play-pause")
                        });

                        options.success.bind($Audio)();
                    });

                    $Audio.audio.addEventListener("error", function ( event ) {
                        $Audio.button.html(options.iconX);
                        $Audio.range.attr("disabled", true);
                        options.error.bind($Audio)($Audio.audio.error);
                    });

                    $Audio.audio.addEventListener("timeupdate", function (e) {
                        Range.update($Audio.audio.currentTime);
                        $Audio.time.html(fullTime($Audio.audio.duration - $Audio.audio.currentTime));
                        options.timeupdate.bind($Audio)($Audio.audio.currentTime);
                    });

                    $Audio.audio.addEventListener("play", function () {
                        $Audio.play();
                    });

                    $Audio.audio.addEventListener("pause", function () {
                        $Audio.pause();
                    });

                    $Audio.audio.addEventListener("ended", function () {
                        $Audio.audio.currentTime = 0;
                        options.ended.bind($Audio)();
                    });

                    $Audio.button.bind("play-pause", function ( e ) {
                        !$Audio.playing ? $Audio.play() : $Audio.pause();
                    });
                }

                if ( !options.blob ) audioEvents(); else {
                    if ( typeof $.blob === "function" ) {
                        $Audio.button.html(options.iconDL);
                        $Audio.button.click(function () {
                            $Audio.blob = $.blob({
                                url     : options.audio,
                                progress: percent => {
                                    $Audio.button.html(options.iconDL);
                                    $Audio.button.find("svg").addClass("animate");
                                    $Audio.time.html(percent + "%")
                                },
                                success : result => {
                                    $Audio.blob  = result;
                                    $Audio.audio = new Audio($Audio.blob);
                                    $(this).unbind("click"); audioEvents();
                                },
                                error  : error => defaultERROR({
                                    status : "blob",
                                    message: error
                                })
                            })
                        });
                    } else {
                        defaultERROR({
                            status : 404,
                            message: "$.blob not defined please import the plugin from : https://github.com/salarizadi/jquery-blob"
                        })
                        $.error("$.blob not defined please import the plugin from : https://github.com/salarizadi/jquery-blob");
                    }
                }
                // END Audio events

                $Audio.node.append($Audio.button); Range.init();
                $Audio.node.append($Audio.time);

                Audios.push($Audio);
            } catch ( e ) {
                $.error(e)
            }
        };
    }
}(window.jQuery));
