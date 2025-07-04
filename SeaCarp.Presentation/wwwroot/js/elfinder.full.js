! function (e, t) {
    if ("function" == typeof define && define.amd) define(["jquery", "jquery-ui"], t);
    else if ("undefined" != typeof exports) {
        var n, i;
        try {
            n = require("jquery"), i = require("jquery-ui")
        } catch (e) { }
        module.exports = t(n)
    } else t(e.jQuery, e.jQuery.ui, !0)
}(this, function (st, e, t) {
    function Fe(e, t, n) {
        function C(n) {
            var i = n.keyCode,
                a = !(!n.ctrlKey && !n.metaKey),
                e = "mousedown" === n.type;
            e || (F.keyState.keyCode = i), F.keyState.ctrlKey = a, F.keyState.shiftKey = n.shiftKey, F.keyState.metaKey = n.metaKey, F.keyState.altKey = n.altKey, e || ("keyup" === n.type ? F.keyState.keyCode = null : q && (st.each(L, function (e, t) {
                t.type == n.type && t.keyCode == i && t.shiftKey == n.shiftKey && t.ctrlKey == a && t.altKey == n.altKey && (n.preventDefault(), n.stopPropagation(), t.callback(n, F), F.debug("shortcut-exec", e + " : " + t.description))
            }), i != st.ui.keyCode.TAB || st(n.target).is(":input") || n.preventDefault(), "keydown" === n.type && i == st.ui.keyCode.ESCAPE && (U.find(".ui-widget:visible").length || F.clipboard().length && F.clipboard([]), st.ui.ddmanager && (e = st.ui.ddmanager.current) && e.helper && e.cancel(), F.toHide(U.find(".ui-widget.elfinder-button-menu.elfinder-frontmost:visible")), F.trigger("keydownEsc", n))))
        }
        var z, s, V, D, T, i, A, j, S, O, I, M, E, K, X, a, o, r, l, J, c, d, p, G, Y, Q, u, Z, ee, te, h, f, m, g, v, F = this,
            ne = [],
            ie = ["button", "tooltip"],
            U = st(e),
            ae = st.extend(!0, {}, st._data(U.get(0), "events")),
            oe = st("<div></div>").append(U.contents()).attr("class", U.attr("class") || "").attr("style", U.attr("style") || ""),
            P = "elfinder-" + (e = U.attr("id") || U.attr("id", "elfauto" + st(".elfinder").length).attr("id")),
            re = "mousedown." + P,
            se = "keydown." + P,
            le = "keypress." + P,
            ce = "keyup." + P,
            q = !1,
            de = !1,
            R = "",
            pe = {
                path: "",
                url: "",
                tmbUrl: "",
                disabled: [],
                separator: "/",
                archives: [],
                extract: [],
                copyOverwrite: !0,
                uploadOverwrite: !0,
                uploadMaxSize: 0,
                jpgQuality: 100,
                tmbCrop: !1,
                tmbReqCustomData: !1,
                tmb: !1
            },
            H = {},
            _ = {},
            b = {},
            y = {},
            ue = [],
            N = {},
            L = {},
            w = [],
            he = {},
            fe = [],
            me = [],
            ge = new F.command(F),
            ve = "auto",
            be = 400,
            x = null,
            ye = "sounds/",
            we = "",
            xe = !1,
            ke = st(document.createElement("audio")).hide().appendTo("body")[0],
            Ce = 0,
            ze = "",
            Te = null,
            Ae = function (e) {
                var i, t, n, a, o, r, s = {},
                    l = {};
                2.1 <= F.api ? (F.commandMap = e.options.uiCmdMap && Object.keys(e.options.uiCmdMap).length ? e.options.uiCmdMap : {}, ze !== JSON.stringify(F.commandMap) && (ze = JSON.stringify(F.commandMap))) : F.options.sync = 0, e.init ? (_ = {}, y = {}) : (o = R, i = "elfinder-subtree-loaded " + F.res("class", "navexpand"), F.res("class", "navcollapse"), t = Object.keys(_), n = function (e) {
                    if (!_[e]) return !0;
                    var t = "directory" === _[e].mime,
                        n = _[e].phash;
                    !(!t || s[n] || !l[n] && F.navHash2Elm(_[e].hash).is(":hidden") && 100 < F.navHash2Elm(n).next(".elfinder-navbar-subtree").children().length) || !t && n === R || he[e] ? t && (l[n] = !0) : (t && !s[n] && (s[n] = !0, F.navHash2Elm(n).removeClass(i).next(".elfinder-navbar-subtree").empty()), Se(_[e]))
                }, a = function () {
                    t.length && (Te && Te._abort(), Te = F.asyncJob(n, t, {
                        interval: 20,
                        numPerOnce: 100
                    }).done(function () {
                        var t = F.storage("hide") || {
                            items: {}
                        };
                        Object.keys(b).length && st.each(b, function (e) {
                            t.items[e] || delete b[e]
                        })
                    }))
                }, F.trigger("filesgc").one("filesgc", function () {
                    t = []
                }), F.one("opendone", function () {
                    o !== R && (U.data("lazycnt") ? F.one("lazydone", a) : a())
                })), F.sorters = {}, R = e.cwd.hash, k(e.files), _[R] ? (r = F.diff([e.cwd], !0)).changed.length && (k(r.changed, "change"), F.change({
                    changed: r.changed
                })) : k([e.cwd]), e.changed && e.changed.length && k(e.changed, "change"), r = JSON.stringify(F.sorters), we !== r && (F.trigger("sorterupdate"), we = r), F.lastDir(R), F.autoSync()
            },
            k = function (e, t) {
                function n(e) {
                    var t = e || {},
                        n = [];
                    st.each(F.sortRules, function (e) {
                        (l[e] || void 0 !== t[e] || "mode" === e && void 0 !== t.perm) && n.push(e)
                    }), F.sorters = F.arrayFlip(n, !0), F.sorters._checked = !0
                }
                for (var i, a, o, r, t = t || "files", s = ["sizeInfo", "encoding"], l = {
                    name: !0,
                    perm: !0,
                    date: !0,
                    size: !0,
                    kind: !0
                }, c = !F.sorters._checked && "files" === t, d = e.length, p = {}, u = F.storage("hide") || {}, h = u.items || {}, f = 0; f < d; f++)
                    if (i = Object.assign({}, e[f]), r = !(u.show || !h[i.hash]), i.name && i.hash && i.mime) {
                        if (r || (c && i.phash === R && (n(i), c = !1), !i.phash || "add" !== t && ("change" !== t || _[i.hash] && i.size === _[i.hash]) || (o = F.parents(i.phash)) && st.each(o, function () {
                            p[this] = !0
                        })), _[i.hash]) {
                            for (a = 0; a < s.length; a++) _[i.hash][s[a]] && !i[s[a]] && (i[s[a]] = _[i.hash][s[a]]);
                            i.sizeInfo && !i.size && (i.size = i.sizeInfo.size), Se(_[i.hash], !0)
                        }
                        h[i.hash] && (b[i.hash] = i), r ? (d--, e.splice(f--, 1)) : ("directory" !== (_[i.hash] = i).mime || y[i.hash] || (y[i.hash] = {}), i.phash && (y[i.phash] || (y[i.phash] = {}), y[i.phash][i.hash] = !0))
                    } st.each(Object.keys(p), function () {
                        var e = _[this];
                        e && e.sizeInfo && delete e.sizeInfo
                    }), c && n()
            },
            je = function (e) {
                function n(a) {
                    var e = _[a];
                    e && ("directory" === e.mime && (o[a] && delete F.roots[o[a]], st.each(F.leafRoots, function (e, t) {
                        var n, i; - 1 !== (n = st.inArray(a, t)) && (1 === t.length ? ((i = Object.assign({}, _[e])) && i._realStats && (st.each(i._realStats, function (e, t) {
                            i[e] = t
                        }), je(_[e]._realStats), F.change({
                            changed: [i]
                        })), delete F.leafRoots[e]) : F.leafRoots[e].splice(n, 1))
                    }), F.searchStatus.state < 2 && st.each(_, function (e, t) {
                        t.phash == a && n(e)
                    })), e.phash && (t = F.parents(e.phash)) && st.each(t, function () {
                        r[this] = !0
                    }), Se(_[a]))
                }
                var t, i = e.length,
                    o = {},
                    r = {};
                for (st.each(F.roots, function (e, t) {
                    o[t] = e
                }); i--;) n(e[i]);
                st.each(Object.keys(r), function () {
                    var e = _[this];
                    e && e.sizeInfo && delete e.sizeInfo
                })
            },
            Se = function (e, t) {
                var n = e.hash,
                    e = e.phash;
                e && y[e] && delete y[e][n], t || (y[n] && delete y[n], F.optionsByHashes[n] && delete F.optionsByHashes[n]), delete _[n]
            },
            Oe = 0,
            W = [],
            B = null,
            Ie = new Date,
            $ = window.parent !== window,
            Me = function () {
                var n, e;
                if ($) try {
                    (e = st("iframe", window.parent.document)).length && st.each(e, function (e, t) {
                        if (t.contentWindow === window) return n = st(t), !1
                    })
                } catch (e) { }
                return n
            }();

        function Ee() {
            F.cssloaded || (E(), F.cssloaded = !0, F.trigger("cssloaded"))
        }

        function De() {
            var e = F.storage("useFullscreen");
            d = F.UA.Fullscreen && (e ? 0 < e : "screen" === F.options.commandsOptions.fullscreen.mode) ? {
                fullElm: function () {
                    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null
                },
                exitFull: function () {
                    return document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.msExitFullscreen ? document.msExitFullscreen() : void 0
                },
                toFull: function (e) {
                    return e.requestFullscreen ? e.requestFullscreen() : e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : !!e.msRequestFullscreen && e.msRequestFullscreen()
                }
            } : {
                fullElm: function () {
                    var e;
                    return U.hasClass(p) ? U.get(0) : (e = U.find("." + p)).length ? e.get(0) : null
                },
                exitFull: function () {
                    var e;
                    st(window).off("resize." + P, u), void 0 !== J && st("body").css("overflow", J), J = void 0, l && (e = l.elm, Q(e), st(e).trigger("resize", {
                        fullscreen: "off"
                    })), st(window).trigger("resize")
                },
                toFull: function (e) {
                    return J = st("body").css("overflow") || "", st("body").css("overflow", "hidden"), st(e).css(F.getMaximizeCss()).addClass(p).trigger("resize", {
                        fullscreen: "on"
                    }), Y(), st(window).on("resize." + P, u).trigger("resize"), !0
                }
            }
        }
        t = t || {}, F.UA.Mobile && st(window).on("orientationchange." + P, function () {
            var e = (screen && screen.orientation && screen.orientation.angle || window.orientation || 0) + 0;
            F.UA.Angle = e = -90 === e ? 270 : e, F.UA.Rotated = e % 180 != 0
        }).trigger("orientationchange." + P), t.bootCallback && "function" == typeof t.bootCallback && (A = n, j = t.bootCallback, n = function (e, t) {
            A && "function" == typeof A && A.call(this, e, t), j.call(this, e, t)
        }), delete t.bootCallback, this.api = null, this.newAPI = !1, this.oldAPI = !1, this.netDrivers = [], this.baseUrl = "", this.i18nBaseUrl = "", this.workerBaseUrl = "", this.cssloaded = !1, this.theme = null, this.mimesCanMakeEmpty = {}, this.bootCallback, this.reloadCallback, this.id = e, this.storage = function () {
            try {
                return "localStorage" in window && null !== window.localStorage ? (F.UA.Safari && (window.localStorage.setItem("elfstoragecheck", 1), window.localStorage.removeItem("elfstoragecheck")), F.localStorage) : F.cookie
            } catch (e) {
                return F.cookie
            }
        }(), this.pauseUnloadCheck = function (e, t) {
            if (void 0 === e) return xe;
            xe = !!e, e && !t && requestAnimationFrame(function () {
                xe = !1
            })
        }, this.options = Object.assign({}, this._options), t.uiOptions && t.uiOptions.toolbar && Array.isArray(t.uiOptions.toolbar) && st.isPlainObject(t.uiOptions.toolbar[t.uiOptions.toolbar.length - 1]) && (F.options.uiOptions.toolbarExtra = Object.assign(F.options.uiOptions.toolbarExtra || {}, t.uiOptions.toolbar.pop())), (S = function (e, n) {
            st.isPlainObject(e) && st.each(e, function (e, t) {
                st.isPlainObject(t) ? (n[e] || (n[e] = {}), S(t, n[e])) : n[e] = t
            })
        })(t, F.options), this.options.uiOptions.toolbar.push(this.options.uiOptions.toolbarExtra), delete this.options.uiOptions.toolbarExtra, this.toUnbindEvents = {}, this.bind = function (e, t, n) {
            var i, a;
            if (t && ("function" == typeof t || "function" == typeof t.done))
                for (a = (e = ("" + e).toLowerCase().replace(/^\s+|\s+$/g, "").split(/\s+/)).length, i = 0; i < a; i++) void 0 === N[e[i]] && (N[e[i]] = []), N[e[i]][n ? "unshift" : "push"](t);
            return this
        }, this.unbind = function (e, t) {
            for (var n, i, a = (e = ("" + e).toLowerCase().split(/\s+/)).length, o = 0; o < a; o++)(n = N[e[o]]) && -1 < (i = st.inArray(t, n)) && n.splice(i, 1);
            return t = null, this
        }, this.trigger = function (e, t, n) {
            var i, a, o, r, e = e.toLowerCase(),
                s = "object" == typeof t,
                l = N[e] || [],
                c = [];
            if (this.debug("event-" + e, t), s && void 0 !== n || (n = !0), a = l.length) {
                for (r = st.Event(e), t && (t._getEvent = function () {
                    return r
                }), n && (r.data = t), i = 0; i < a; i++)
                    if (l[i])
                        if (l[i].done) c.push(l[i].done);
                        else {
                            if (l[i].length && !n) {
                                if (void 0 === o) try {
                                    o = JSON.stringify(t)
                                } catch (e) {
                                    o = !1
                                }
                                r.data = o ? JSON.parse(o) : t
                            }
                            try {
                                if (!1 === l[i].call(r, r, this) || r.isDefaultPrevented()) {
                                    this.debug("event-stoped", r.type);
                                    break
                                }
                            } catch (e) {
                                window.console && window.console.log && window.console.log(e)
                            }
                        } if (a = c.length)
                    for (i = 0; i < a; i++) try {
                        if (!1 === c[i].call(r, r, this) || r.isDefaultPrevented()) {
                            this.debug("event-stoped", r.type + "(done)");
                            break
                        }
                    } catch (e) {
                        window.console && window.console.log && window.console.log(e)
                    }
                this.toUnbindEvents[e] && this.toUnbindEvents[e].length && (st.each(this.toUnbindEvents[e], function (e, t) {
                    F.unbind(t.type, t.callback)
                }), delete this.toUnbindEvents[e])
            }
            return this
        }, this.getListeners = function (e) {
            return e ? N[e.toLowerCase()] : N
        }, this.baseUrl = F.options.baseUrl || (e = "", O = null, st("head > script").each(function () {
            if (this.src && this.src.match(/js\/elfinder(?:-[a-z0-9_-]+)?\.(?:min|full)\.js(?:$|\?)/i)) return O = st(this), !1
        }), "" !== (e = O && !(e = O.attr("src").replace(/js\/[^\/]+$/, "")).match(/^(https?\/\/|\/)/) && (M = st("head > base[href]").attr("href")) ? M.replace(/\/$/, "") + "/" + e : e) ? F.options.baseUrl = e : (F.options.baseUrl || (F.options.baseUrl = "./"), e = F.options.baseUrl), e), this.i18nBaseUrl = (this.options.i18nBaseUrl || this.baseUrl + "js/i18n").replace(/\/$/, "") + "/", this.workerBaseUrl = (this.options.workerBaseUrl || this.baseUrl + "js/worker").replace(/\/$/, "") + "/", this.options.maxErrorDialogs = Math.max(1, parseInt(this.options.maxErrorDialogs || 5)), pe.dispInlineRegex = this.options.dispInlineRegex, this.options.cssAutoLoad && (I = F.baseUrl, M = st('head > link[href$="css/elfinder.min.css"],link[href$="css/elfinder.full.css"]:first').length, E = function () {
            U.data("cssautoloadHide") && (U.data("cssautoloadHide").remove(), U.removeData("cssautoloadHide"))
        }, M || (F.cssloaded = null), Array.isArray(F.options.cssAutoLoad) && (F.options.themes.default ? !0 === F.cssloaded ? F.loadCss(F.options.cssAutoLoad) : F.bind("cssloaded", function () {
            F.loadCss(F.options.cssAutoLoad)
        }) : (F.options.themes = Object.assign({
            default: {
                name: "default",
                cssurls: F.options.cssAutoLoad
            }
        }, F.options.themes), F.options.theme || (F.options.theme = "default"))), null === F.cssloaded && (U.addClass("elfinder").data("cssautoloadHide", st("<style>.elfinder{visibility:hidden;overflow:hidden}</style>")), st("head").append(U.data("cssautoloadHide")), F.options.themes.default || (F.options.themes = Object.assign({
            default: {
                name: "default",
                cssurls: "css/theme.css",
                author: "elFinder Project",
                license: "3-clauses BSD"
            }
        }, F.options.themes), F.options.theme || (F.options.theme = "default")), requestAnimationFrame(function () {
            "hidden" === U.css("visibility") ? F.loadCss([I + "css/elfinder.min.css"], {
                dfd: st.Deferred().done(function () {
                    Ee()
                }).fail(function () {
                    E(), F.cssloaded || (F.cssloaded = !1, F.bind("init", function () {
                        F.cssloaded || F.error(["errRead", "CSS (elfinder.min)"])
                    }))
                })
            }) : Ee()
        }))), e = F.options.themes, (r = Object.keys(e || {})).length && (e[K = F.storage("theme") || F.options.theme] || (K = r[0]), F.cssloaded ? F.changeTheme(K) : F.bind("cssloaded", function () {
            F.changeTheme(K)
        })), this.optionProperties = {
            icon: void 0,
            csscls: void 0,
            tmbUrl: void 0,
            uiCmdMap: {},
            netkey: void 0,
            disabled: []
        }, $ || this.options.enableAlways || 2 !== st("body").children().length || (this.options.enableAlways = !0), !0 === this.options.debug ? this.options.debug = "all" : Array.isArray(this.options.debug) ? (X = {}, st.each(F.options.debug, function () {
            X[this] = !0
        }), F.options.debug = X) : this.options.debug = !1, this.noConflicts = {}, this.noConflict = function () {
            st.each(ie, function (e, t) {
                st.fn[t] && "function" == typeof st.fn[t].noConflict && (F.noConflicts[t] = st.fn[t].noConflict())
            })
        }, this.noConflict(), this.isCORS = !1, void 0 !== F.options.cors && null !== F.options.cors ? F.isCORS = !!F.options.cors : (e = document.createElement("a"), o = window.location.protocol, r = function (e) {
            return "https:" === (e = e && ":" !== e ? e : o) ? /\:443$/ : /\:80$/
        }, g = window.location.host.replace(r(o), ""), e.href = t.url, t.urlUpload && t.urlUpload !== t.url && ((a = document.createElement("a")).href = t.urlUpload), (g !== e.host.replace(r(e.protocol), "") || ":" !== e.protocol && "" !== e.protocol && o !== e.protocol || a && (g !== a.host.replace(r(a.protocol), "") || ":" !== a.protocol && "" !== a.protocol && o !== a.protocol)) && (F.isCORS = !0)), F.isCORS && (st.isPlainObject(F.options.customHeaders) || (F.options.customHeaders = {}), st.isPlainObject(F.options.xhrFields) || (F.options.xhrFields = {}), F.options.requestType = "post", F.options.customHeaders["X-Requested-With"] = "XMLHttpRequest", F.options.xhrFields.withCredentials = !0), this.requestType = /^(get|post)$/i.test(this.options.requestType) ? this.options.requestType.toLowerCase() : "get", V = Math.max(parseInt(this.options.requestMaxConn), 1), this.optsCustomData = st.isPlainObject(this.options.customData) ? this.options.customData : {}, this.customData = Object.assign({}, this.optsCustomData), this.prevCustomData = null, this.customHeaders = st.isPlainObject(this.options.customHeaders) ? this.options.customHeaders : {}, this.xhrFields = st.isPlainObject(this.options.xhrFields) ? this.options.xhrFields : {}, this.replaceXhrSend = function () {
            i = i || XMLHttpRequest.prototype.send, XMLHttpRequest.prototype.send = function () {
                var t = this;
                return F.customHeaders && st.each(F.customHeaders, function (e) {
                    t.setRequestHeader(e, this)
                }), F.xhrFields && st.each(F.xhrFields, function (e) {
                    e in t && (t[e] = this)
                }), i.apply(this, arguments)
            }
        }, this.restoreXhrSend = function () {
            i && (XMLHttpRequest.prototype.send = i)
        }, this.abortCmdsOnOpen = this.options.abortCmdsOnOpen || ["tmb", "parents"], this.navPrefix = "nav" + (Fe.prototype.uniqueid || "") + "-", this.cwdPrefix = Fe.prototype.uniqueid ? "cwd" + Fe.prototype.uniqueid + "-" : "", ++Fe.prototype.uniqueid, this.uploadURL = t.urlUpload || t.url, this.namespace = P, this.today = new Date(Ie.getFullYear(), Ie.getMonth(), Ie.getDate()).getTime() / 1e3, this.yesterday = this.today - 86400, e = this.options.UTCDate ? "UTC" : "", this.getHours = "get" + e + "Hours", this.getMinutes = "get" + e + "Minutes", this.getSeconds = "get" + e + "Seconds", this.getDate = "get" + e + "Date", this.getDay = "get" + e + "Day", this.getMonth = "get" + e + "Month", this.getFullYear = "get" + e + "FullYear", this.zIndex, this.searchStatus = {
            state: 0,
            query: "",
            target: "",
            mime: "",
            mixed: !1,
            ininc: !1
        }, this.lang = this.storage("lang") || this.options.lang, "jp" === this.lang && (this.lang = this.options.lang = "ja"), this.viewType = this.storage("view") || this.options.defaultView || "icons", this.sortType = this.storage("sortType") || this.options.sortType || "name", this.sortOrder = this.storage("sortOrder") || this.options.sortOrder || "asc", this.sortStickFolders = this.storage("sortStickFolders"), null === this.sortStickFolders ? this.sortStickFolders = !!this.options.sortStickFolders : this.sortStickFolders = !!this.sortStickFolders, this.sortAlsoTreeview = this.storage("sortAlsoTreeview"), null === this.sortAlsoTreeview || null === this.options.sortAlsoTreeview ? this.sortAlsoTreeview = !!this.options.sortAlsoTreeview : this.sortAlsoTreeview = !!this.sortAlsoTreeview, this.sortRules = st.extend(!0, {}, this._sortRules, this.options.sortRules), st.each(this.sortRules, function (e, t) {
            "function" != typeof t && delete F.sortRules[e]
        }), this.compare = st.proxy(this.compare, this), this.notifyDelay = 0 < this.options.notifyDelay ? parseInt(this.options.notifyDelay) : 500, this.draggingUiHelper = null, this.droppable = {
            greedy: !0,
            tolerance: "pointer",
            accept: ".elfinder-cwd-file-wrapper,.elfinder-navbar-dir,.elfinder-cwd-file,.elfinder-cwd-filename",
            hoverClass: this.res("class", "adroppable"),
            classes: {
                "ui-droppable-hover": this.res("class", "adroppable")
            },
            autoDisable: !0,
            drop: function (e, t) {
                var n, i, a, o = st(this),
                    r = st.grep(t.helper.data("files") || [], function (e) {
                        return !!e
                    }),
                    s = [],
                    l = [],
                    c = [],
                    d = t.helper.hasClass("elfinder-drag-helper-plus");
                if (void 0 === e.button || t.helper.data("namespace") !== P || !F.insideWorkzone(e.pageX, e.pageY)) return !1;
                for (i = o.hasClass(F.res("class", "cwdfile")) ? F.cwdId2Hash(o.attr("id")) : o.hasClass(F.res("class", "navdir")) ? F.navId2Hash(o.attr("id")) : R, n = r.length; n--;)((a = r[n]) != i && _[a].phash != i ? s : d && a !== i && _[i].write ? l : c).push(a);
                if (c.length) return !1;
                t.helper.data("droped", !0), l.length && (t.helper.hide(), F.exec("duplicate", l, {
                    _userAction: !0
                })), s.length && (t.helper.hide(), F.clipboard(s, !d), F.exec("paste", i, {
                    _userAction: !0
                }, i).always(function () {
                    F.clipboard([]), F.trigger("unlockfiles", {
                        files: r
                    })
                }), F.trigger("drop", {
                    files: r
                }))
            }
        }, this.enabled = function () {
            return q && this.visible()
        }, this.visible = function () {
            return U[0].elfinder && U.is(":visible")
        }, this.isRoot = function (e) {
            return !(!e.isroot && e.phash)
        }, this.root = function (n, e) {
            var i, t;
            if (n = n || R, !e && (st.each(F.roots, function (e, t) {
                if (0 === n.indexOf(e)) return i = t, !1
            }), i)) return i;
            for (i = _[n]; i && i.phash && (e || !i.isroot);) i = _[i.phash];
            if (i) return i.hash;
            for (; t in _ && _.hasOwnProperty(t);)
                if ("directory" === (i = _[t]).mime && !i.phash && i.read) return i.hash;
            return ""
        }, this.cwd = function () {
            return _[R] || {}
        }, this.option = function (n, i) {
            var a, e;
            return i = i || R, F.optionsByHashes[i] && void 0 !== F.optionsByHashes[i][n] ? F.optionsByHashes[i][n] : !F.hasVolOptions || R === i || (e = F.file(i)) && e.phash === R ? H[n] || "" : (a = "", st.each(F.volOptions, function (e, t) {
                if (0 === i.indexOf(e)) return a = t[n] || "", !1
            }), a)
        }, this.getDisabledCmds = function (e, t) {
            var n = {
                hidden: !0
            };
            return Array.isArray(e) || (e = [e]), st.each(e, function (e, t) {
                t = F.option("disabledFlip", t);
                t && Object.assign(n, t)
            }), t ? n : Object.keys(n)
        }, this.file = function (e, t) {
            return e ? _[e] || (t ? b[e] : void 0) : void 0
        }, this.files = function (t) {
            var n = {};
            return t ? y[t] ? (st.each(y[t], function (e) {
                _[e] ? n[e] = _[e] : delete y[t][e]
            }), Object.assign({}, n)) : {} : Object.assign({}, _)
        }, this.parents = function (e) {
            for (var t, n = []; e && (t = this.file(e));) n.unshift(t.hash), e = t.phash;
            return n
        }, this.path2array = function (e, t) {
            for (var n, i = []; e;) {
                if (!(n = _[e]) || !n.hash) {
                    i = [];
                    break
                }
                i.unshift(t && n.i18 ? n.i18 : n.name), e = n.isroot ? null : n.phash
            }
            return i
        }, this.path = function (e, t, n) {
            var i, a, o, r, s, l, c = _[e] && _[e].path ? _[e].path : this.path2array(e, t).join(H.separator);
            return n && _[e] ? (n = Object.assign({
                notify: {
                    type: "parents",
                    cnt: 1,
                    hideCnt: !0
                }
            }, n), i = st.Deferred(), a = n.notify, o = !1, r = function () {
                F.request({
                    data: {
                        cmd: "parents",
                        target: _[e].phash
                    },
                    notify: a,
                    preventFail: !0
                }).done(s).fail(function () {
                    i.reject()
                })
            }, s = function () {
                F.one("parentsdone", function () {
                    "" === (c = F.path(e, t)) && o ? (o = !1, r()) : (a && (clearTimeout(l), a.cnt = -parseInt(a.cnt || 0), F.notify(a)), i.resolve(c))
                })
            }, c ? i.resolve(c) : (F.ui.tree ? (a && (l = setTimeout(function () {
                F.notify(a)
            }, F.notifyDelay)), s(o = !0)) : r(), i)) : c
        }, this.url = function (t, e) {
            function n(e) {
                return e ? d(e) : a.url ? d(a.url) : (i = void 0 === i ? p() : i) ? d(i + st.map(F.path2array(t), function (e) {
                    return encodeURIComponent(e)
                }).slice(1).join("/")) : (e = Object.assign({}, F.customData, {
                    cmd: "file",
                    target: a.hash
                }), F.oldAPI && (e.cmd = "open", e.current = a.phash), d(F.options.url + (-1 === F.options.url.indexOf("?") ? "?" : "&") + st.param(e, !0)))
            }
            var i, a = _[t],
                e = e || {},
                o = e.async || !1,
                r = e.temporary || !1,
                s = e.onetime && F.option("onetimeUrl", t) || !1,
                l = e.absurl || !1,
                c = o || s ? st.Deferred() : null,
                d = function (e) {
                    return e = e && l ? F.convAbsUrl(e) : e
                },
                p = function () {
                    return F.option("url", !F.isRoot(a) && a.phash || a.hash)
                };
            if (!a || !a.read) return o ? c.resolve("") : "";
            if (!s || a.url && "1" != a.url || (i = p()))
                if ("1" == a.url || r && !a.url && !(i = p())) this.request({
                    data: {
                        cmd: "url",
                        target: t,
                        options: {
                            temporary: r ? 1 : 0
                        }
                    },
                    preventDefault: !0,
                    options: {
                        async: o
                    },
                    notify: o ? {
                        type: r ? "file" : "url",
                        cnt: 1,
                        hideCnt: !0
                    } : {},
                    progressBar: e.progressBar
                }).done(function (e) {
                    a.url = e.url || ""
                }).fail(function () {
                    a.url = ""
                }).always(function () {
                    var e;
                    if (a.url && r && (e = a.url, a.url = "1"), !o) return n(e);
                    c.resolve(n(e))
                });
                else {
                    if (!o) return n();
                    c.resolve(n())
                }
            else o = !0, this.request({
                data: {
                    cmd: "url",
                    target: t,
                    options: {
                        onetime: 1
                    }
                },
                preventDefault: !0,
                options: {
                    async: o
                },
                notify: {
                    type: "file",
                    cnt: 1,
                    hideCnt: !0
                },
                progressBar: e.progressBar
            }).done(function (e) {
                c.resolve(d(e.url || ""))
            }).fail(function () {
                c.resolve("")
            });
            return o ? c : void 0
        }, this.forExternalUrl = function (e, t) {
            var n = {
                async: !0,
                absurl: !0
            };
            return n[F.option("onetimeUrl", e) ? "onetime" : "temporary"] = !0, F.url(e, Object.assign({}, t, n))
        }, this.openUrl = function (e, t, n, i) {
            var a = _[e],
                o = "",
                r = (i || {}).onetimeSize || 5242880;
            return a && a.read ? t && "sameorigin" !== t || (a.url ? 1 != a.url && (o = a.url) : H.url && 0 === a.hash.indexOf(F.cwd().volumeid) && (o = H.url + st.map(this.path2array(e), function (e) {
                return encodeURIComponent(e)
            }).slice(1).join("/")), t && !this.isSameOrigin(o) || !o) ? n && this.hasParrotHeaders() ? (i ? delete i.onetimeSize : i = {}, !i.onetime && !i.temporary && a.size > r && (a.mime.match(/^video|audio/) ? i.temporary = !0 : i.onetime = !0), (i.onetime || i.temporary ? this.url(a.hash, Object.assign({
                async: !0
            }, i)).done(function (e) {
                n(e)
            }) : this.getContents(e, "blob", i).done(function (e) {
                o = (window.URL || window.webkitURL).createObjectURL(e), n(o)
            })).fail(function () {
                n("")
            })) : (o = (o = this.options.url) + (-1 === o.indexOf("?") ? "?" : "&") + (this.oldAPI ? "cmd=open&current=" + a.phash : "cmd=file") + "&target=" + a.hash + "&_t=" + (a.ts || parseInt(+new Date / 1e3)), !0 === t && (o += "&download=1"), st.each(this.customData, function (e, t) {
                o += "&" + encodeURIComponent(e) + "=" + encodeURIComponent(t)
            }), n ? void n(o) : o) : (o += (o.match(/\?/) ? "&" : "?") + "_".repeat((o.match(/[\?&](_+)t=/g) || ["&t="]).sort().shift().match(/[\?&](_*)t=/)[1].length + 1) + "t=" + (a.ts || parseInt(+new Date / 1e3)), n ? void n(o) : o) : ""
        }, this.tmb = function (e) {
            var t, n = "elfinder-cwd-bgurl",
                i = "",
                a = {},
                o = 0;
            return !(!st.isPlainObject(e) || ((F.searchStatus.state && 0 !== e.hash.indexOf(F.cwd().volumeid) ? (t = F.option("tmbUrl", e.hash), F.option("tmbCrop", e.hash)) : (t = H.tmbUrl, H.tmbCrop)) && (n += " elfinder-cwd-bgurl-crop"), "self" === t && 0 === e.mime.indexOf("image/") ? (i = F.openUrl(e.hash), n += " elfinder-cwd-bgself") : (F.oldAPI || t) && e && e.tmb && 1 != e.tmb ? i = t + e.tmb : F.newAPI && e && e.tmb && 1 != e.tmb && (i = e.tmb), !i)) && ("self" !== t && (e.ts && (a._t = e.ts), H.tmbReqCustomData && Object.keys(this.customData).length && (a = Object.assign(a, this.customData)), Object.keys(a).length && (i += i.match(/\?/) ? "&" : "?", st.each(a, function (e, t) {
                i += (0 == o++ ? "" : "&") + encodeURIComponent(e) + "=" + encodeURIComponent(t)
            }))), {
                url: i,
                className: n
            })
        }, this.selected = function () {
            return ue.slice(0)
        }, this.selectedFiles = function () {
            return st.map(ue, function (e) {
                return _[e] ? Object.assign({}, _[e]) : null
            })
        }, this.fileByName = function (e, t) {
            for (var n in _)
                if (_.hasOwnProperty(n) && _[n].phash == t && _[n].name == e) return _[n]
        }, this.validResponse = function (e, t) {
            return t.error || this.rules[this.rules[e] ? e : "defaults"](t)
        }, this.returnBytes = function (e) {
            var t;
            return isNaN(e) ? (t = (e = (e = e || "").replace(/b$/i, "")).charAt(e.length - 1).toLowerCase(), e = e.replace(/[tgmk]$/i, ""), "t" == t ? e = 1024 * e * 1024 * 1024 * 1024 : "g" == t ? e = 1024 * e * 1024 * 1024 : "m" == t ? e = 1024 * e * 1024 : "k" == t && (e *= 1024), e = isNaN(e) ? 0 : parseInt(e)) : (e = parseInt(e)) < 1 && (e = 0), e
        }, this.request = function (n) {
            function e() {
                return y.type && y.cnt && (w && (y.cancel = s, n.eachCancel && (y.id = +new Date)), t = setTimeout(function () {
                    v = setTimeout(F, 1e3), l.notify(y), b = !0, s.always(function () {
                        y.cnt = -(parseInt(y.cnt) || 0), l.notify(y), b = !1
                    })
                }, l.notifyDelay), s.always(function () {
                    clearTimeout(t)
                })), Oe < V ? D() : (h ? W.unshift(D) : W.push(D), s)
            }
            var t, o, i, a, l = this,
                r = this.options,
                s = st.Deferred(),
                c = (+new Date).toString(16) + Math.floor(1e3 * Math.random()).toString(16),
                d = Object.assign({}, l.customData, {
                    mimes: r.onlyMimes
                }, n.data || n),
                p = d.cmd,
                u = "binary" === (n.options || {}).dataType,
                h = !n.asNotOpen && "open" === p,
                f = !(u || n.preventDefault || n.preventFail),
                m = !(u || n.preventDefault || n.preventDone),
                g = n.progressVal || 20,
                v = null,
                b = !1,
                y = !n.progressBar && n.notify ? Object.assign({
                    progress: g * n.notify.cnt
                }, n.notify) : {},
                w = !!n.cancel,
                x = u || !!n.raw,
                k = n.syncOnFail,
                C = !!n.lazy,
                z = n.prepare,
                T = n.navigate,
                A = (n.options || {}).cache,
                j = Object.assign({
                    url: r.url,
                    async: !0,
                    type: this.requestType,
                    dataType: "json",
                    cache: 2.1029 <= l.api,
                    data: d,
                    headers: this.customHeaders,
                    xhrFields: this.xhrFields,
                    progress: function (e) {
                        var t = e.loaded / e.total * 100;
                        if (v && clearTimeout(v), n.progressBar) try {
                            n.progressBar.width(t + "%")
                        } catch (e) { } else b && y.type && (t *= y.cnt, g < t && (l.notify({
                            type: y.type,
                            progress: t - g,
                            cnt: 0,
                            hideCnt: y.hideCnt
                        }), g = t));
                        if (n.progress) try {
                            n.progress(e)
                        } catch (e) { }
                    }
                }, n.options || {}),
                S = function (e) {
                    e.warning && l.error(e.warning), h ? Ae(e) : l.updateCache(e), l.lazy(function () {
                        e.removed && e.removed.length && l.remove(e), e.added && e.added.length && l.add(e), e.changed && e.changed.length && l.change(e)
                    }).then(function () {
                        return l.lazy(function () {
                            l.trigger(p, e, !1)
                        })
                    }).then(function () {
                        return l.lazy(function () {
                            l.trigger(p + "done")
                        })
                    }).then(function () {
                        e.toasts && Array.isArray(e.toasts) && st.each(e.toasts, function () {
                            this.msg && l.toast(this)
                        }), e.sync && l.sync()
                    })
                },
                O = function (e, t) {
                    var n, i, a = l.options.debug;
                    switch (t) {
                        case "abort":
                            n = e.quiet ? "" : ["errConnect", "errAbort"];
                            break;
                        case "timeout":
                            n = ["errConnect", "errTimeout"];
                            break;
                        case "parsererror":
                            n = ["errResponse", "errDataNotJSON"], !e.responseText || R && (!a || "all" !== a && !a["backend-error"]) || n.push(e.responseText);
                            break;
                        default:
                            if (e.responseText) try {
                                (i = JSON.parse(e.responseText)) && i.error && (n = i.error)
                            } catch (e) { }
                            if (!n)
                                if (403 == e.status) n = ["errConnect", "errAccess", "HTTP error " + e.status];
                                else if (404 == e.status) n = ["errConnect", "errNotFound", "HTTP error " + e.status];
                                else if (500 <= e.status) n = ["errResponse", "errServerError", "HTTP error " + e.status];
                                else {
                                    if (414 == e.status && "get" === j.type) return j.type = "post", l.abortXHR(e), void (s.xhr = e = l.transport.send(j).fail(n).done(I));
                                    n = e.quiet ? "" : ["errConnect", "HTTP error " + e.status]
                                }
                    }
                    l.trigger(p + "done"), s.reject({
                        error: n
                    }, e, t)
                },
                I = function (a) {
                    if (l.currentReqCmd = p, a.debug && l.responseDebug(a), l.setCustomHeaderByXhr(o), x) return l.abortXHR(o), a && a.debug && l.debug("backend-debug", a), s.resolve(a);
                    if (!a) return s.reject({
                        error: ["errResponse", "errDataEmpty"]
                    }, o, a);
                    if (!st.isPlainObject(a)) return s.reject({
                        error: ["errResponse", "errDataNotJSON"]
                    }, o, a);
                    if (a.error) return h && st.each(l.leafRoots, function (e, t) {
                        l.leafRoots[e] = st.grep(t, function (e) {
                            return e !== d.target
                        })
                    }), s.reject({
                        error: a.error
                    }, o, a);

                    function e() {
                        function e(n) {
                            l.leafRoots[d.target] && a[n] && st.each(l.leafRoots[d.target], function (e, t) {
                                (t = l.file(t)) && a[n].push(t)
                            })
                        }

                        function t() {
                            l.textMimes = {}, st.each(l.res("mimes", "text"), function () {
                                l.textMimes[this.toLowerCase()] = !0
                            })
                        }
                        var i;
                        if (h ? e("files") : "tree" === p && e("tree"), a = l.normalize(a), !l.validResponse(p, a)) return s.reject({
                            error: a.norError || "errResponse"
                        }, o, a);
                        h && (l.api || (l.api = a.api || 1, "2.0" == l.api && void 0 !== a.options.uploadMaxSize && (l.api = "2.1"), l.newAPI = 2 <= l.api, l.oldAPI = !l.newAPI), a.textMimes && Array.isArray(a.textMimes) && (l.resources.mimes.text = a.textMimes, t()), l.textMimes || t(), a.options && (H = Object.assign({}, pe, a.options)), a.netDrivers && (l.netDrivers = a.netDrivers), a.maxTargets && (l.maxTargets = a.maxTargets), d.init && (l.uplMaxSize = l.returnBytes(a.uplMaxSize), l.uplMaxFile = a.uplMaxFile ? Math.min(parseInt(a.uplMaxFile), 50) : 20)), "function" == typeof z && z(a), T && (i = T.target || "added", a[i] && a[i].length && l.one(p + "done", function () {
                            function e(e) {
                                var t, n, i, a, o = void 0;
                                return ((e.action ? e.action.data : void 0) || s.length) && e.action && (i = e.action.msg) && (n = e.action.cmd) && (!e.action.cwdNot || e.action.cwdNot !== l.cwd().hash) && (a = e.action.done, t = e.action.data, o = st("<div></div>").append(st('<button type="button" class="ui-button ui-widget ui-state-default ui-corner-all elfinder-tabstop"><span class="ui-button-text">' + l.i18n(i) + "</span></button>").on("mouseenter mouseleave", function (e) {
                                    st(this).toggleClass("ui-state-hover", "mouseenter" == e.type)
                                }).on("click", function () {
                                    l.exec(n, t || s, {
                                        _userAction: !0,
                                        _currentType: "toast",
                                        _currentNode: st(this)
                                    }), a && l.one(n + "done", function () {
                                        "function" == typeof a ? a() : "select" === a && l.trigger("selectfiles", {
                                            files: r()
                                        })
                                    })
                                }))), delete e.action, e.extNode = o, e
                            }
                            var n = a[i],
                                t = l.findCwdNodes(n),
                                r = function () {
                                    var t = l.cwd().hash;
                                    return st.map(n, function (e) {
                                        return e.phash && t === e.phash ? e.hash : null
                                    })
                                },
                                s = r();
                            T.toast || (T.toast = {}), T.noselect || l.trigger("selectfiles", {
                                files: 1 < l.searchStatus.state ? st.map(n, function (e) {
                                    return e.hash
                                }) : s
                            }), t.length ? (T.noscroll || (t.first().trigger("scrolltoview", {
                                blink: !1
                            }), l.resources.blink(t, "lookme")), st.isPlainObject(T.toast.incwd) && l.toast(e(T.toast.incwd))) : st.isPlainObject(T.toast.inbuffer) && l.toast(e(T.toast.inbuffer))
                        })), s.resolve(a), a.debug && l.debug("backend-debug", a)
                    }
                    l.abortXHR(o), C ? l.lazy(e) : e()
                },
                M = function (e) {
                    o && "pending" === o.state() && (l.abortXHR(o, {
                        quiet: !0,
                        abort: !0
                    }), e && ("unload" === e.type || "destroy" === e.type) || l.autoSync())
                },
                E = function (e) {
                    if (l.trigger(p + "done"), "autosync" == e.type) {
                        if ("stop" != e.data.action) return
                    } else if (!("unload" == e.type || "destroy" == e.type || "openxhrabort" == e.type || e.data.added && e.data.added.length)) return;
                    M(e)
                },
                D = function (e) {
                    function t() {
                        k = !1, s.reject()
                    }
                    if (e && "cmd" === e) return p;
                    if (h) {
                        if (B && "pending" === B.state()) {
                            if (B._target === d.target) return s.reject("openabort");
                            B.xhr ? B.xhr.queueAbort() : B.reject("openabort")
                        } (B = s)._target = d.target
                    }
                    if (s.always(function () {
                        delete j.headers["X-elFinderReqid"], h && (B = null)
                    }).fail(function (e, t, n) {
                        h && "openabort" === e && (e = "", k = !1), t = {
                            cmd: p,
                            err: e,
                            xhr: t,
                            rc: n
                        }, 0 === e && W.length && (W = st.grep(W, function (e) {
                            return e("cmd") !== p
                        })), l.trigger("requestError", t), t._getEvent && t._getEvent().isDefaultPrevented() && (k = f = !1, e && (e.error = "")), M(), h && (a = l.file(d.target)) && a.volumeid && l.isRoot(a) && delete l.volumeExpires[a.volumeid], l.trigger(p + "fail", n), (t = "object" == typeof e ? e.error : e) && (f ? l.error(t) : l.debug("error", l.i18n(t))), k && l.sync()
                    }), !p) return k = !1, s.reject({
                        error: "errCmdReq"
                    });
                    if (l.maxTargets && d.targets && d.targets.length > l.maxTargets) return k = !1, s.reject({
                        error: ["errMaxTargets", l.maxTargets]
                    });
                    if (m && s.done(S), h) {
                        for (; i = fe.pop();) i.queueAbort();
                        if (R !== d.target)
                            for (; i = me.pop();) i.queueAbort()
                    }
                    return -1 !== st.inArray(p, (l.cmdsToAdd + " autosync").split(" ")) && ("autosync" !== p && (l.autoSync("stop"), s.always(function () {
                        l.autoSync()
                    })), l.trigger("openxhrabort")), delete j.preventFail, 2.1029 <= l.api && (A ? j.headers["X-elFinderReqid"] = c : Object.assign(j.data, {
                        reqid: c
                    })), s.syncOnFail = function (e) {
                        k = !!e
                    }, Oe++, s.xhr = o = l.transport.send(j).always(function () {
                        j._xhr && void 0 !== j._xhr.responseURL && (o.responseURL = j._xhr.responseURL || ""), --Oe, W.length && W.shift()()
                    }).fail(O).done(I), 2.1029 <= l.api && (o._requestId = c), h || d.compare && "info" === p ? (o.queueAbort = t, fe.unshift(o), d.compare && l.bind(l.cmdsToAdd + " autosync openxhrabort", E), s.always(function () {
                        var e = st.inArray(o, fe);
                        d.compare && l.unbind(l.cmdsToAdd + " autosync openxhrabort", E), -1 !== e && fe.splice(e, 1)
                    })) : -1 !== st.inArray(p, l.abortCmdsOnOpen) && (o.queueAbort = t, me.unshift(o), s.always(function () {
                        var e = st.inArray(o, me); - 1 !== e && me.splice(e, 1)
                    })), l.bind("unload destroy", E), s.always(function () {
                        l.unbind("unload destroy", E)
                    }), s
                },
                F = function () {
                    var e;
                    b && v && (e = +y.cnt, v = null, l.notify({
                        type: y.type,
                        progress: e,
                        cnt: 0,
                        hideCnt: y.hideCnt
                    }), (g += e) / y.cnt < 80 && (v = setTimeout(F, 500)))
                },
                u = {
                    opts: n,
                    result: !0
                };
            return l.api || d.init ? (l.trigger("request." + p, u, !0), u.result ? "object" == typeof u.result && u.result.promise ? (u.result.done(e).fail(function () {
                l.trigger(p + "done"), s.reject()
            }), s) : e() : (l.trigger(p + "done"), s.reject())) : (k = !1, s.reject())
        }, this.cache = function (e, t) {
            Array.isArray(e) || (e = [e]), k(e, t)
        }, this.updateCache = function (e) {
            st.isPlainObject(e) && (e.files && e.files.length && k(e.files, "files"), e.tree && e.tree.length && k(e.tree, "tree"), e.removed && e.removed.length && je(e.removed), e.added && e.added.length && k(e.added, "add"), e.changed && e.changed.length && k(e.changed, "change"))
        }, this.diff = function (e, n, t) {
            var i = {},
                o = [],
                a = [],
                r = [],
                s = null;
            return st.each(e, function (e, t) {
                i[t.hash] = t
            }), t && t.length && (s = {}, st.each(t, function () {
                s[this] = !0
            })), st.each(_, function (e, t) {
                i[e] || n && t.phash !== n || a.push(e)
            }), st.each(i, function (e, t) {
                var n, i = _[e],
                    a = {};
                i ? (st.each(Object.keys(i), function () {
                    a[this] = !0
                }), st.each(t, function (e) {
                    if (delete a[e], !(s && s[e] || t[e] === i[e])) return r.push(t), !(a = {})
                }), 0 !== (n = Object.keys(a).length) && (s && st.each(a, function (e) {
                    s[e] && --n
                }), 0 !== n && r.push(t))) : o.push(t)
            }), st.each(a, function (e, t) {
                var t = _[t],
                    n = t.phash;
                n && "directory" == t.mime && -1 === st.inArray(n, a) && i[n] && ! function (e) {
                    for (var t = r.length; t--;)
                        if (r[t].hash == e) return !0
                }(n) && r.push(i[n])
            }), {
                added: o,
                removed: a,
                changed: r
            }
        }, this.syncStopper = !1, this.sync = function (o, n) {
            if (this.syncStopper) return st.Deferred().reject();
            this.syncStopper = !0, this.autoSync("stop");
            var i, a, r, s, l = this,
                c = (a = "", s = r = 0, o && n && st.each(_, function (e, t) {
                    t.phash && t.phash === o && (++r, s = Math.max(s, t.ts)), a = r + ":" + s
                }), a),
                d = st.Deferred().always(function () {
                    i || l.trigger("sync")
                }),
                p = [this.request({
                    data: {
                        cmd: "open",
                        reload: 1,
                        target: R,
                        tree: !o && this.ui.tree ? 1 : 0,
                        compare: c
                    },
                    preventDefault: !0
                })];
            return !o && 2 <= l.api && (R !== this.root() && p.push(this.request({
                data: {
                    cmd: "parents",
                    target: R
                },
                preventDefault: !0
            })), st.each(function () {
                for (var e, t = [], n = l.file(l.root(R)), i = n ? n.volumeid : null, a = l.cwd().phash; a;) a = (e = l.file(a)) ? (0 !== a.indexOf(i) && (t.push({
                    target: a,
                    cmd: "tree"
                }), l.isRoot(e) || t.push({
                    target: a,
                    cmd: "parents"
                }), i = (n = l.file(l.root(a))) ? n.volumeid : null), e.phash) : null;
                return t
            }(), function (e, t) {
                p.push(l.request({
                    data: {
                        cmd: t.cmd,
                        target: t.target
                    },
                    preventDefault: !0
                }))
            })), st.when.apply(st, p).fail(function (e, t) {
                i = t && 200 != t.status, n && -1 === st.inArray("errOpen", e) ? d.reject(e && 0 != t.status ? e : void 0) : (d.reject(e), l.parseError(e) && l.request({
                    data: {
                        cmd: "open",
                        target: l.lastDir("") || l.root(),
                        tree: 1,
                        init: 1
                    },
                    notify: {
                        type: "open",
                        cnt: 1,
                        hideCnt: !0
                    }
                }))
            }).done(function (e) {
                var t, n, i;
                if (e.cwd.compare && c === e.cwd.compare) return d.reject();
                if (t = {
                    tree: []
                }, 1 < (n = arguments.length))
                    for (i = 1; i < n; i++) arguments[i].tree && arguments[i].tree.length && t.tree.push.apply(t.tree, arguments[i].tree);
                if (l.api < 2.1 && (t.tree || (t.tree = []), t.tree.push(e.cwd)), e = l.normalize(e), !l.validResponse("open", e)) return d.reject(e.norError || "errResponse");
                if (t = l.normalize(t), !l.validResponse("tree", t)) return d.reject(t.norError || "errResponse");
                var a = l.diff(e.files.concat(t && t.tree ? t.tree : []), o);
                return a.added.push(e.cwd), l.updateCache(a), a.removed.length && l.remove(a), a.added.length && l.add(a), a.changed.length && l.change(a), d.resolve(a)
            }).always(function () {
                l.syncStopper = !1, l.autoSync()
            }), d
        }, this.upload = function (e) {
            return this.transport.upload(e, this)
        }, this.shortcut = function (e) {
            var t, n, i, a, o;
            if (this.options.allowShortcuts && e.pattern && "function" == typeof e.callback)
                for (t = e.pattern.toUpperCase().split(/\s+/), a = 0; a < t.length; a++)(i = 1 == (i = (o = (n = t[a]).split("+")).pop()).length ? 0 < i ? i : i.charCodeAt(0) : 0 < i ? i : st.ui.keyCode[i]) && !L[n] && (L[n] = {
                    keyCode: i,
                    altKey: -1 != st.inArray("ALT", o),
                    ctrlKey: -1 != st.inArray("CTRL", o),
                    shiftKey: -1 != st.inArray("SHIFT", o),
                    type: e.type || "keydown",
                    callback: e.callback,
                    description: e.description,
                    pattern: n
                });
            return this
        }, this.shortcuts = function () {
            var n = [];
            return st.each(L, function (e, t) {
                n.push([t.pattern, F.i18n(t.description)])
            }), n
        }, this.clipboard = function (e, n) {
            function t() {
                return st.map(w, function (e) {
                    return e.hash
                })
            }
            return void 0 !== e && (w.length && this.trigger("unlockfiles", {
                files: t()
            }), he = {}, w = st.map(e || [], function (e) {
                var t = _[e];
                return t ? (he[e] = !0, {
                    hash: e,
                    phash: t.phash,
                    name: t.name,
                    mime: t.mime,
                    read: t.read,
                    locked: t.locked,
                    cut: !!n
                }) : null
            }), this.trigger("changeclipboard", {
                clipboard: w.slice(0, w.length)
            }), n && this.trigger("lockfiles", {
                files: t()
            })), w.slice(0, w.length)
        }, this.isCommandEnabled = function (e, t) {
            var n = F.cwd().volumeid || "",
                n = !(t = !t && 1 < F.searchStatus.state && F.selected().length ? F.selected()[0] : t) || n && 0 === t.indexOf(n) ? H.disabledFlip : F.option("disabledFlip", t);
            return !!(t = this._commands[e]) && (t.alwaysEnabled || !n[e])
        }, this.exec = function (e, t, n, i) {
            var a, o;
            return "open" === (e = !i && this.commandMap[e] && "hidden" !== this.commandMap[e] ? this.commandMap[e] : e) && ((this.searchStatus.state || this.searchStatus.ininc) && this.trigger("searchend", {
                noupdate: !0
            }), this.autoSync("stop")), !i && t && (st.isArray(t) ? t.length && (i = t[0]) : i = t), "object" == (o = typeof (a = this._commands[e] && this.isCommandEnabled(e, i) ? this._commands[e].exec(t, n) : st.Deferred().reject("errUnknownCmd"))) && a.promise || (F.debug("warning", '"cmd.exec()" should be returned "$.Deferred" but cmd "' + e + '" returned "' + o + '"'), a = st.Deferred().resolve()), this.trigger("exec", {
                dfrd: a,
                cmd: e,
                files: t,
                opts: n,
                dstHash: i
            }), a
        }, this.dialog = function (e, t) {
            function n() {
                !i.data("draged") && i.is(":visible") && i.elfinderdialog("posInit")
            }
            var i = st("<div></div>").append(e).appendTo(U).elfinderdialog(t, F),
                e = i.closest(".ui-dialog");
            return e.length && (F.bind("resize", n), e.on("remove", function () {
                F.unbind("resize", n)
            })), i
        }, this.toast = function (e) {
            return st('<div class="ui-front"></div>').appendTo(this.ui.toast).elfindertoast(e || {}, this)
        }, this.getUI = function (e) {
            return e ? this.ui[e] || st() : U
        }, this.getCommand = function (e) {
            return void 0 === e ? this._commands : this._commands[e]
        }, this.resize = function (e, t) {
            var n, i = !U.hasClass("ui-resizable"),
                a = U.data("resizeSize") || {
                    w: 0,
                    h: 0
                },
                o = {};
            x && x.data("resizeTm") && clearTimeout(x.data("resizeTm")), F.options.noResizeBySelf || ("string" == typeof t && (n = t.match(/^([0-9.]+)%$/)) && ((x = x && x.length ? x : st(window)).data("marginToMyNode") || x.data("marginToMyNode", function () {
                for (var e = U.outerHeight(!0) - U.innerHeight(), t = U; t.get(0) !== x.get(0) && (e += (t = t.parent()).outerHeight(!0) - t.innerHeight(), t.parent().length););
                return e
            }()), x.data("fitToBaseFunc") || x.data("fitToBaseFunc", function (e) {
                var t = x.data("resizeTm");
                e.preventDefault(), e.stopPropagation(), t && cancelAnimationFrame(t), U.hasClass("elfinder-fullscreen") || F.UA.Mobile && x.data("rotated") === F.UA.Rotated || (x.data("rotated", F.UA.Rotated), x.data("resizeTm", requestAnimationFrame(function () {
                    F.restoreSize()
                })))
            }), void 0 === x.data("rotated") && x.data("rotated", F.UA.Rotated), t = x.height() * (n[1] / 100) - x.data("marginToMyNode"), x.off("resize." + F.namespace, x.data("fitToBaseFunc")), i && x.on("resize." + F.namespace, x.data("fitToBaseFunc"))), U.css({
                width: e,
                height: parseInt(t)
            })), o.w = Math.round(U.width()), o.h = Math.round(U.height()), U.data("resizeSize", o), o.w === a.w && o.h === a.h || (U.trigger("resize"), this.trigger("resize", {
                width: o.w,
                height: o.h
            }))
        }, this.restoreSize = function () {
            this.resize(ve, be)
        }, this.show = function () {
            U.show(), this.enable().trigger("show")
        }, this.hide = function () {
            this.options.enableAlways && (de = q, q = !1), this.disable(), this.trigger("hide"), U.hide()
        }, this.lazy = function (e, t, i) {
            function n() {
                o.resolve(e.call(o)), a(!1)
            }
            var a = function (e) {
                var t, n = U.data("lazycnt");
                e ? (t = !U.data("lazyrepaint") && i.repaint, n ? U.data("lazycnt", ++n) : U.data("lazycnt", 1).addClass("elfinder-processing"), t && U.data("lazyrepaint", !0).css("display")) : n && 1 < n ? U.data("lazycnt", --n) : (t = U.data("lazyrepaint"), U.data("lazycnt", 0).removeData("lazyrepaint").removeClass("elfinder-processing"), t && U.css("display"), F.trigger("lazydone"))
            },
                o = st.Deferred();
            return t = t || 0, i = i || {}, a(!0), t ? setTimeout(n, t) : requestAnimationFrame(n), o
        }, this.destroy = function () {
            U && U[0].elfinder && (U.hasClass("elfinder-fullscreen") && F.toggleFullscreen(U), this.options.syncStart = !1, this.autoSync("forcestop"), this.trigger("destroy").disable(), w = [], ue = [], N = {}, L = {}, st(window).off("." + P), st(document).off("." + P), F.trigger = function () { }, st(ke).remove(), U.off().removeData().empty().append(oe.contents()).attr("class", oe.attr("class")).attr("style", oe.attr("style")), delete U[0].elfinder, st.each(ae, function (e, t) {
                st.each(t, function (e, t) {
                    U.on(t.type + (t.namespace ? "." + t.namespace : ""), t.selector, t.handler)
                })
            }))
        }, this.autoSync = function (e) {
            var r;
            1e3 <= F.options.sync && (s && (clearTimeout(s), s = null, F.trigger("autosync", {
                action: "stop"
            })), "stop" === e ? ++Ce : Ce = Math.max(0, --Ce), !Ce && "forcestop" !== e && F.options.syncStart && (r = function (e) {
                var o;
                H.syncMinMs && (e || s) && (e && F.trigger("autosync", {
                    action: "start"
                }), o = Math.max(F.options.sync, H.syncMinMs), s && clearTimeout(s), s = setTimeout(function () {
                    var n, i = !0,
                        a = R;
                    H.syncChkAsTs && _[a] && (n = _[a].ts) ? F.request({
                        data: {
                            cmd: "info",
                            targets: [a],
                            compare: n,
                            reload: 1
                        },
                        preventDefault: !0
                    }).done(function (e) {
                        var t;
                        i = !0, (i = e.compare && (t = e.compare) == n ? !1 : i) ? F.sync(a).always(function () {
                            t && (_[a].ts = t), r()
                        }) : r()
                    }).fail(function (e, t) {
                        e = F.parseError(e);
                        e && 0 != t.status ? (F.error(e), Array.isArray(e) && -1 !== st.inArray("errOpen", e) && F.request({
                            data: {
                                cmd: "open",
                                target: F.lastDir("") || F.root(),
                                tree: 1,
                                init: 1
                            },
                            notify: {
                                type: "open",
                                cnt: 1,
                                hideCnt: !0
                            }
                        })) : s = setTimeout(function () {
                            r()
                        }, o)
                    }) : F.sync(R, !0).always(function () {
                        r()
                    })
                }, o))
            })(!0))
        }, this.insideWorkzone = function (e, t, n) {
            var i = this.getUI("workzone").data("rectangle");
            return !(e < i.left + (n = n || 1) || e > i.left + i.width + n || t < i.top + n || t > i.top + i.height + n)
        }, this.toFront = function (e) {
            var t = U.children(".ui-front").removeClass("elfinder-frontmost"),
                n = t.last();
            t.css("z-index", ""), st(e).addClass("ui-front elfinder-frontmost").css("z-index", n.css("z-index") + 1)
        }, this.toHide = function (e, t) {
            var n, e = st(e);
            t || e.hide(), e.hasClass("elfinder-frontmost") && (e.removeClass("elfinder-frontmost"), (n = U.children(".ui-front:visible:not(.elfinder-frontmost)").last()).length && requestAnimationFrame(function () {
                U.children(".elfinder-frontmost:visible").length || (F.toFront(n), n.trigger("frontmost"))
            }))
        }, this.getMaximizeCss = function () {
            return {
                width: "100%",
                height: "100%",
                margin: 0,
                top: 0,
                left: 0,
                display: "block",
                position: "fixed",
                zIndex: Math.max(F.zIndex ? F.zIndex + 1 : 0, 1e3),
                maxWidth: "",
                maxHeight: ""
            }
        }, $ && F.UA.Fullscreen && (F.UA.Fullscreen = !1, Me && void 0 !== Me.attr("allowfullscreen") && (F.UA.Fullscreen = !0)), p = "elfinder-fullscreen", G = "elfinder-fullscreen-native", Y = function () {
            var i = 0,
                a = 0;
            st.each(U.children(".ui-dialog,.ui-draggable"), function (e, t) {
                var t = st(t),
                    n = t.position();
                n.top < 0 && (t.css("top", i), i += 20), n.left < 0 && (t.css("left", a), a += 20)
            })
        }, Q = function (e) {
            l && l.elm == e && (st(e).removeClass(p + " " + G).attr("style", l.style), l = null)
        }, u = function (e) {
            var t;
            e.target === window && (c && cancelAnimationFrame(c), c = requestAnimationFrame(function () {
                (t = d.fullElm()) && st(t).trigger("resize", {
                    fullscreen: "on"
                })
            }))
        }, De(), st(document).on("fullscreenchange." + P + " webkitfullscreenchange." + P + " mozfullscreenchange." + P + " MSFullscreenChange." + P, function (e) {
            var t, n;
            F.UA.Fullscreen && (t = d.fullElm(), n = st(window), c && cancelAnimationFrame(c), null === t ? (n.off("resize." + P, u), l && (t = l.elm, Q(t), st(t).trigger("resize", {
                fullscreen: "off"
            }))) : (st(t).addClass(p + " " + G).attr("style", "width:100%; height:100%; margin:0; padding:0;").trigger("resize", {
                fullscreen: "on"
            }), n.on("resize." + P, u), Y()), n.trigger("resize"))
        }), F.toggleFullscreen = function (e, t) {
            var n, e = st(e).get(0);
            if (n = d.fullElm()) {
                if (n == e) {
                    if (!0 === t) return n
                } else if (!1 === t) return n;
                return d.exitFull(), null
            }
            return !1 === t ? null : (De(), !(l = {
                elm: e,
                style: st(e).attr("style")
            }) !== d.toFull(e) ? e : l = null)
        }, ee = "elfinder-maximized", te = function (e) {
            var t;
            e.target === window && e.data && e.data.elm && (t = e.data.elm, Z && cancelAnimationFrame(Z), Z = requestAnimationFrame(function () {
                t.trigger("resize", {
                    maximize: "on"
                })
            }))
        }, F.toggleMaximize = function (e, t) {
            var n, e = st(e);
            e.hasClass(ee) ? !0 !== t && (n = e, st(window).off("resize." + P, te), st("body").css("overflow", n.data("bodyOvf")), n.removeClass(ee).attr("style", n.data("orgStyle")).removeData("bodyOvf").removeData("orgStyle"), n.trigger("resize", {
                maximize: "off"
            })) : !1 !== t && ((n = e).data("bodyOvf", st("body").css("overflow") || "").data("orgStyle", n.attr("style")).addClass(ee).css(F.getMaximizeCss()), st("body").css("overflow", "hidden"), st(window).on("resize." + P, {
                elm: n
            }, te), n.trigger("resize", {
                maximize: "on"
            }))
        }, Object.assign(st.ui.keyCode, {
            F1: 112,
            F2: 113,
            F3: 114,
            F4: 115,
            F5: 116,
            F6: 117,
            F7: 118,
            F8: 119,
            F9: 120,
            F10: 121,
            F11: 122,
            F12: 123,
            DIG0: 48,
            DIG1: 49,
            DIG2: 50,
            DIG3: 51,
            DIG4: 52,
            DIG5: 53,
            DIG6: 54,
            DIG7: 55,
            DIG8: 56,
            DIG9: 57,
            NUM0: 96,
            NUM1: 97,
            NUM2: 98,
            NUM3: 99,
            NUM4: 100,
            NUM5: 101,
            NUM6: 102,
            NUM7: 103,
            NUM8: 104,
            NUM9: 105,
            CONTEXTMENU: 93,
            DOT: 190
        }), this.dragUpload = !1, this.xhrUpload = ("undefined" != typeof XMLHttpRequestUpload || "undefined" != typeof XMLHttpRequestEventTarget) && "undefined" != typeof File && "undefined" != typeof FormData, this.transport = {}, "object" == typeof this.options.transport && (this.transport = this.options.transport, "function" == typeof this.transport.init && this.transport.init(this)), "function" != typeof this.transport.send && (this.transport.send = function (e) {
            return F.UA.IE || (e._xhr = new XMLHttpRequest, e.xhr = function () {
                return e.progress && e._xhr.addEventListener("progress", e.progress), e._xhr
            }), st.ajax(e)
        }), "iframe" == this.transport.upload ? this.transport.upload = st.proxy(this.uploads.iframe, this) : "function" == typeof this.transport.upload ? this.dragUpload = !!this.options.dragUploadAllow : this.xhrUpload && this.options.dragUploadAllow ? (this.transport.upload = st.proxy(this.uploads.xhr, this), this.dragUpload = !0) : this.transport.upload = st.proxy(this.uploads.iframe, this), this.decodeRawString = function (e) {
            for (var t, o = function (e) {
                for (var t = 0, n = e.length, i = []; t < n; t++) i.push(e.charCodeAt(t));
                return i
            }, n = function (e) {
                for (var t, n = [], i = 0, a = (e = "string" == typeof e ? o(e) : e).length; t = e[i], i < a; i++) 55296 <= t && t <= 56319 ? n.push(64 + (1023 & t) << 10 | 1023 & e[++i]) : n.push(t);
                return n
            }(e), i = String.fromCharCode, a = 0, r = n.length, s = ""; t = n[a], a < r; a++) s += t <= 127 ? i(t) : t <= 223 && 194 <= t ? i((31 & t) << 6 | 63 & n[++a]) : t <= 239 && 224 <= t ? i((15 & t) << 12 | (63 & n[++a]) << 6 | 63 & n[++a]) : t <= 247 && 240 <= t ? i(55296 | ((7 & t) << 8 | (63 & n[++a]) << 2 | n[++a] >>> 4 & 3) - 64, 56320 | (15 & n[a++]) << 6 | 63 & n[a]) : i(65533);
            return s
        }, this.getContents = function (e, t, n) {
            var i, a, o = st.Deferred(),
                t = t || "arraybuffer";
            return o.fail(function () {
                a && "pending" === a.state() && a.reject()
            }), i = this.openUrl(e), this.isSameOrigin(i) || (i = this.openUrl(e, !0)), a = this.request(Object.assign({
                data: {
                    cmd: "get"
                },
                options: {
                    url: i,
                    type: "get",
                    cache: !0,
                    dataType: "binary",
                    responseType: t,
                    processData: !1
                },
                notify: {
                    type: "file",
                    cnt: 1,
                    hideCnt: !0
                },
                cancel: !0
            }, n || {})).fail(function () {
                o.reject()
            }).done(function (e) {
                o.resolve(e)
            }), o
        }, this.getBinaryByUrl = function (e, t, n) {
            var i, a = st.Deferred();
            return a.fail(function () {
                i && "pending" === i.state() && i.reject()
            }), i = this.request(Object.assign({
                data: {
                    cmd: "get"
                },
                options: Object.assign({
                    type: "get",
                    cache: !0,
                    dataType: "binary",
                    responseType: "blob",
                    processData: !1
                }, e)
            }, n || {})).fail(function () {
                a.reject()
            }).done(function (e) {
                t && t(e), a.resolve(e)
            }), a
        }, this.getMimetype = function (e, t) {
            var n = t,
                e = (e + "").match(/\.([^.]+)$/);
            return e && (e = e[1]) && ((n = (z = z || F.arrayFlip(F.mimeTypes))[e.toLowerCase()]) || (n = t)), n
        }, F.hashCheckers = [], h = this, f = {}, window.Worker && window.ArrayBuffer && (h.options.cdns.sparkmd5 && (f.SparkMD5 = !0, h.hashCheckers.push("md5")), h.options.cdns.jssha && (f.jsSHA = !0, h.hashCheckers = h.hashCheckers.concat(["sha1", "sha224", "sha256", "sha384", "sha512", "sha3-224", "sha3-256", "sha3-384", "sha3-512", "shake128", "shake256"]))), h.getContentsHashes = function (o, e, t, n) {
            var i, r = st.Deferred(),
                s = h.arrayFlip(e || ["md5"], !0),
                l = [],
                c = {},
                d = t || {
                    shake128len: 256,
                    shake256len: 512
                };
            return r.fail(function () {
                i && i.reject()
            }), Object.keys(f).length ? i = h.getContents(o, "arraybuffer", n).done(function (t) {
                s.md5 && f.SparkMD5 && l.push(function () {
                    var n = st.Deferred();
                    try {
                        var i = h.getWorker();
                        n.fail(function () {
                            i && i.terminate()
                        }), i.onmessage = function (e) {
                            var t;
                            i && i.terminate(), e.data.hash ? (c.md5 = e.data.hash, (t = h.file(o)) && (t.md5 = c.md5)) : e.data.error && (c.md5 = e.data.error), r.notify(c), n.resolve()
                        }, i.onerror = function (e) {
                            n.reject()
                        }, i.postMessage({
                            scripts: [h.options.cdns.sparkmd5, h.getWorkerUrl("calcfilehash.js")],
                            data: {
                                type: "md5",
                                bin: t
                            }
                        }), r.fail(function () {
                            n.reject()
                        })
                    } catch (e) {
                        n.reject(), delete f.SparkMD5
                    }
                    return n
                }()), f.jsSHA && st.each(["1", "224", "256", "384", "512", "3-224", "3-256", "3-384", "3-512", "ke128", "ke256"], function (e, a) {
                    s["sha" + a] && l.push(function () {
                        var n = st.Deferred();
                        try {
                            var i = h.getWorker();
                            n.fail(function () {
                                i && i.terminate()
                            }), i.onmessage = function (e) {
                                var t;
                                i && i.terminate(), e.data.hash ? (c["sha" + a] = e.data.hash, (t = h.file(o)) && (t["sha" + a] = c["sha" + a])) : e.data.error && (c["sha" + a] = e.data.error), r.notify(c), n.resolve()
                            }, i.onerror = function (e) {
                                n.reject()
                            }, i.postMessage({
                                scripts: [h.options.cdns.jssha, h.getWorkerUrl("calcfilehash.js")],
                                data: {
                                    type: a,
                                    bin: t,
                                    hashOpts: d
                                }
                            }), r.fail(function () {
                                n.reject()
                            })
                        } catch (e) {
                            n.reject(), delete f.jsSHA
                        }
                        return n
                    }())
                }), l.length ? st.when.apply(null, l).always(function () {
                    r.resolve(c)
                }) : r.reject()
            }).fail(function () {
                r.reject()
            }) : r.reject(), r
        }, this.parseError = function (e) {
            return e = st.isPlainObject(e) ? e.error : e
        }, this.error = function () {
            var e = arguments[0],
                t = arguments[1] || null;
            return 1 == arguments.length && "function" == typeof e ? F.bind("error", e) : !0 !== (e = this.parseError(e)) && e ? F.trigger("error", {
                error: e,
                opts: t
            }) : this
        }, st.each(["enable", "disable", "load", "open", "reload", "select", "add", "remove", "change", "dblclick", "getfile", "lockfiles", "unlockfiles", "selectfiles", "unselectfiles", "dragstart", "dragstop", "search", "searchend", "viewchange"], function (e, t) {
            F[t] = function () {
                var e = arguments[0];
                return 1 == arguments.length && "function" == typeof e ? F.bind(t, e) : F.trigger(t, st.isPlainObject(e) ? e : {})
            }
        }), this.enable(function () {
            !q && F.api && F.visible() && F.ui.overlay.is(":hidden") && !U.children(".elfinder-dialog." + F.res("class", "editing") + ":visible").length && (q = !0, document.activeElement && document.activeElement.blur(), U.removeClass("elfinder-disabled"))
        }).disable(function () {
            de = q, q = !1, U.addClass("elfinder-disabled")
        }).open(function () {
            ue = []
        }).select(function (e) {
            var t = 0,
                n = [];
            ue = st.grep(e.data.selected || e.data.value || [], function (e) {
                return n.length || F.maxTargets && ++t > F.maxTargets ? (n.push(e), !1) : !!_[e]
            }), n.length && (F.trigger("unselectfiles", {
                files: n,
                inselect: !0
            }), F.toast({
                mode: "warning",
                msg: F.i18n(["errMaxTargets", F.maxTargets])
            }))
        }).error(function (e) {
            var t = {
                cssClass: "elfinder-dialog-error",
                title: F.i18n("error"),
                resizable: !1,
                destroyOnClose: !0,
                buttons: {}
            },
                n = F.getUI();
            n.children(".elfinder-dialog-error").length < F.options.maxErrorDialogs ? (t.buttons[F.i18n(F.i18n("btnClose"))] = function () {
                st(this).elfinderdialog("close")
            }, e.data.opts && st.isPlainObject(e.data.opts) && Object.assign(t, e.data.opts), F.dialog('<span class="elfinder-dialog-icon elfinder-dialog-icon-error"></span>' + F.i18n(e.data.error), t)) : (t = (e = n.children(".elfinder-dialog-error:last").children(".ui-dialog-content:first")).children(".elfinder-error-counter")).length ? t.data("cnt", parseInt(t.data("cnt")) + 1).html(F.i18n(["moreErrors", t.data("cnt")])) : (t = st('<span class="elfinder-error-counter">' + F.i18n(["moreErrors", 1]) + "</span>").data("cnt", 1), e.append("<br/>", t))
        }).bind("tmb", function (e) {
            st.each(e.data.images || [], function (e, t) {
                _[e] && (_[e].tmb = t)
            })
        }).bind("searchstart", function (e) {
            Object.assign(F.searchStatus, e.data), F.searchStatus.state = 1
        }).bind("search", function (e) {
            F.searchStatus.state = 2
        }).bind("searchend", function () {
            F.searchStatus.state = 0, F.searchStatus.ininc = !1, F.searchStatus.mixed = !1
        }).bind("canMakeEmptyFile", function (e) {
            var e = e.data,
                t = {};
            e && Array.isArray(e.mimes) && (e.unshift || (t = F.mimesCanMakeEmpty), st.each(e.mimes, function () {
                t[this] || (t[this] = F.mimeTypes[this])
            }), e.unshift && (F.mimesCanMakeEmpty = Object.assign(t, F.mimesCanMakeEmpty)))
        }).bind("themechange", function () {
            requestAnimationFrame(function () {
                F.trigger("uiresize")
            })
        }), !0 === this.options.sound && this.bind("playsound", function (e) {
            var t = ke.canPlayType && ke.canPlayType('audio/wav; codecs="1"'),
                e = e.data && e.data.soundFile;
            t && e && "" != t && "no" != t && st(ke).html('<source src="' + ye + e + '" type="audio/wav">')[0].play()
        }), st.each(this.options.handlers, function (e, t) {
            F.bind(e, t)
        }), this.history = new this.history(this), this.roots = {}, this.leafRoots = {}, this.volumeExpires = {}, this._commands = {}, Array.isArray(this.options.commands) || (this.options.commands = []), -1 !== st.inArray("*", this.options.commands) && (this.options.commands = Object.keys(this.commands)), this.commandMap = {}, this.volOptions = {}, this.hasVolOptions = !1, this.trashes = {}, this.optionsByHashes = {}, this.uiAutoHide = [], this.one("open", function () {
            F.uiAutoHide.length && setTimeout(function () {
                F.trigger("uiautohide")
            }, 500)
        }), this.bind("uiautohide", function () {
            F.uiAutoHide.length && F.uiAutoHide.shift()()
        }), this.options.width && (ve = this.options.width), this.options.height && (be = this.options.height), this.options.heightBase && (x = st(this.options.heightBase)), ye = this.options.soundPath ? this.options.soundPath.replace(/\/+$/, "") + "/" : this.baseUrl + ye, this.options.parrotHeaders && Array.isArray(this.options.parrotHeaders) && this.options.parrotHeaders.length ? (this.parrotHeaders = this.options.parrotHeaders, st.each(this.parrotHeaders, function (e, t) {
            var n = F.sessionStorage("core-ph:" + t);
            n && (F.customHeaders[t] = n)
        })) : this.parrotHeaders = [], F.one("opendone", function () {
            var t;
            st(document).on("click." + P, function (e) {
                !q || F.options.enableAlways || st(e.target).closest(U).length || F.disable()
            }).on(se + " " + le + " " + ce + " " + re, C), F.options.useBrowserHistory && st(window).on("popstate." + P, function (e) {
                var t, n, i = e.originalEvent.state || {},
                    e = !!i.thash,
                    a = U.find(".elfinder-frontmost:visible"),
                    o = U.find(".elfinder-navbar-dir,.elfinder-cwd-filename").find("input,textarea");
                e || (i = {
                    thash: F.cwd().hash
                }, st("html,body").animate({
                    scrollTop: U.offset().top
                })), a.length || o.length ? (history.pushState(i, null, location.pathname + location.search + "#elf_" + i.thash), a.length ? a.hasClass(F.res("class", "preventback")) || (a.hasClass("elfinder-contextmenu") ? st(document).trigger(st.Event("keydown", {
                    keyCode: st.ui.keyCode.ESCAPE,
                    ctrlKey: !1,
                    shiftKey: !1,
                    altKey: !1,
                    metaKey: !1
                })) : a.hasClass("elfinder-dialog") ? a.elfinderdialog("close") : a.trigger("close")) : o.trigger(st.Event("keydown", {
                    keyCode: st.ui.keyCode.ESCAPE,
                    ctrlKey: !1,
                    shiftKey: !1,
                    altKey: !1,
                    metaKey: !1
                }))) : e ? st.isEmptyObject(F.files()) || F.request({
                    data: {
                        cmd: "open",
                        target: i.thash,
                        onhistory: 1
                    },
                    notify: {
                        type: "open",
                        cnt: 1,
                        hideCnt: !0
                    },
                    syncOnFail: !0
                }) : (F.one("open", t = function () {
                    n.trigger("click")
                }, !0), n = F.toast({
                    msg: F.i18n("pressAgainToExit"),
                    onHidden: function () {
                        F.unbind("open", t), history.pushState(i, null, location.pathname + location.search + "#elf_" + i.thash)
                    }
                }))
            }), st(window).on("resize." + P, function (e) {
                e.target === this && (t && cancelAnimationFrame(t), t = requestAnimationFrame(function () {
                    var e = U.data("resizeSize") || {
                        w: 0,
                        h: 0
                    },
                        t = {
                            w: Math.round(U.width()),
                            h: Math.round(U.height())
                        };
                    U.data("resizeSize", t), t.w === e.w && t.h === e.h || (U.trigger("resize"), F.trigger("resize", {
                        width: t.w,
                        height: t.h
                    }))
                }))
            }).on("beforeunload." + P, function (e) {
                var t, n;
                if (!F.pauseUnloadCheck()) {
                    if (U.is(":visible") && (F.ui.notify.children().length && -1 !== st.inArray("hasNotifyDialog", F.options.windowCloseConfirm) ? t = F.i18n("ntfsmth") : U.find("." + F.res("class", "editing")).length && -1 !== st.inArray("editingFile", F.options.windowCloseConfirm) ? t = F.i18n("editingFile") : (n = Object.keys(F.selected()).length) && -1 !== st.inArray("hasSelectedItem", F.options.windowCloseConfirm) ? t = F.i18n("hasSelected", "" + n) : (n = Object.keys(F.clipboard()).length) && -1 !== st.inArray("hasClipboardData", F.options.windowCloseConfirm) && (t = F.i18n("hasClipboard", "" + n)), t)) return e.returnValue = t;
                    F.trigger("unload")
                }
            }), st(window).on("message." + P, function (e) {
                var t, n, i = e.originalEvent || null;
                if (i && (0 === F.convAbsUrl(F.options.url).indexOf(i.origin) || 0 === F.convAbsUrl(F.uploadURL).indexOf(i.origin))) try {
                    (n = (t = JSON.parse(i.data)).data || null) && (n.error ? (t.bind && F.trigger(t.bind + "fail", n), F.error(n.error)) : (n.warning && F.error(n.warning), F.updateCache(n), n.removed && n.removed.length && F.remove(n), n.added && n.added.length && F.add(n), n.changed && n.changed.length && F.change(n), t.bind && (F.trigger(t.bind, n), F.trigger(t.bind + "done")), n.sync && F.sync()))
                } catch (e) {
                    F.sync()
                }
            }), F.options.enableAlways ? (st(window).on("focus." + P, function (e) {
                e.target === this && F.enable()
            }), $ && st(window.top).on("focus." + P, function () {
                !F.enable() || Me && !Me.is(":visible") || requestAnimationFrame(function () {
                    st(window).trigger("focus")
                })
            })) : $ && st(window).on("blur." + P, function (e) {
                q && e.target === this && F.disable()
            }), $ && U.on("click", function (e) {
                st(window).trigger("focus")
            }), F.options.enableByMouseOver && U.on("mouseenter touchstart", function (e) {
                $ && st(window).trigger("focus"), F.enabled() || F.enable()
            }), st(window).on("visibilitychange." + P, function (e) {
                var t = document.hidden || document.webkitHidden || document.msHidden;
                F.options.syncStart && F.autoSync(t ? "stop" : void 0)
            })
        }), U[0].elfinder = this, ne.push((m = F.lang, g = F.i18nBaseUrl + "elfinder." + m + ".js", v = st.Deferred().done(function () {
            F.i18[m] && (F.lang = m), F.trigger("i18load"), D = "en" === F.lang ? F.i18.en : st.extend(!0, {}, F.i18.en, F.i18[F.lang])
        }), F.i18[m] ? v.resolve() : (F.lang = "en", F.hasRequire ? require([g], function () {
            v.resolve()
        }, function () {
            v.resolve()
        }) : F.loadScript([g], function () {
            v.resolve()
        }, {
            loadType: "tag",
            error: function () {
                v.resolve()
            }
        })), v)), T = function () {
            var t, s, l, c, d, p, u, n, i, o, r, h, f, m, g, v, b, y, w, x, k, C, a, z, e, T, A, j, S;
            return F.messages = D.messages, st.fn.selectable && st.fn.draggable && st.fn.droppable && st.fn.resizable && st.fn.button && st.fn.slider ? U.length ? F.options.url ? (t = Object.assign({
                name: F.i18n("name"),
                perm: F.i18n("perms"),
                date: F.i18n("modify"),
                size: F.i18n("size"),
                kind: F.i18n("kind"),
                modestr: F.i18n("mode"),
                modeoct: F.i18n("mode"),
                modeboth: F.i18n("mode")
            }, F.options.uiOptions.cwd.listView.columnsCustomName), F.getColumnName = function (e) {
                e = t[e] || F.i18n(e);
                return "function" == typeof e ? e() : e
            }, F.direction = D.direction, F.dateFormat = F.options.dateFormat || D.dateFormat, F.fancyFormat = F.options.fancyDateFormat || D.fancyDateFormat, F.nonameDateFormat = (F.options.nonameDateFormat || D.nonameDateFormat).replace(/[\/\\]/g, "_"), F.cssClass = "ui-helper-reset ui-helper-clearfix ui-widget ui-widget-content ui-corner-all elfinder elfinder-" + ("rtl" == F.direction ? "rtl" : "ltr") + (F.UA.Touch ? " elfinder-touch" + (F.options.resizable ? " touch-punch" : "") : "") + (F.UA.Mobile ? " elfinder-mobile" : "") + (F.UA.iOS ? " elfinder-ios" : "") + " " + F.options.cssClass, U.addClass(F.cssClass).on(re, function () {
                q || F.enable()
            }), u = se + "draggable keyup." + P + "draggable", F.draggable = {
                appendTo: U,
                addClasses: !1,
                distance: 4,
                revert: !0,
                refreshPositions: !1,
                cursor: "crosshair",
                cursorAt: {
                    left: 50,
                    top: 47
                },
                scroll: !1,
                start: function (e, t) {
                    var n, i, a = t.helper,
                        o = st.grep(a.data("files") || [], function (e) {
                            return !!e && (he[e] = !0)
                        }),
                        r = !1;
                    for (p = U.attr("style"), U.width(U.width()).height(U.height()), s = "ltr" === F.direction, l = F.getUI("workzone").data("rectangle"), c = l.top + l.height, d = c - F.getUI("navdock").outerHeight(!0), F.draggingUiHelper = a, n = o.length; n--;)
                        if (i = o[n], _[i].locked) {
                            a.data("locked", r = !0);
                            break
                        } r || F.trigger("lockfiles", {
                            files: o
                        }), a.data("autoScrTm", setInterval(function () {
                            a.data("autoScr") && F.autoScroll[a.data("autoScr")](a.data("autoScrVal"))
                        }, 50))
                },
                drag: function (e, t) {
                    var n, i, a, t = t.helper;
                    ((i = l.top > e.pageY) || d < e.pageY) && (n = l.cwdEdge > e.pageX ? (s ? "navbar" : "cwd") + (i ? "Up" : "Down") : (s ? "cwd" : "navbar") + (i ? "Up" : "Down"), i || ("cwd" === n.substr(0, 3) ? c < e.pageY ? a = c : n = null : a = d), n && (t.data("autoScr", n), t.data("autoScrVal", Math.pow(i ? l.top - e.pageY : e.pageY - a, 1.3)))), n || t.data("autoScr") && t.data("refreshPositions", 1).data("autoScr", null), t.data("refreshPositions") && st(this).elfUiWidgetInstance("draggable") && (0 < t.data("refreshPositions") ? (st(this).draggable("option", {
                        refreshPositions: !0,
                        elfRefresh: !0
                    }), t.data("refreshPositions", -1)) : (st(this).draggable("option", {
                        refreshPositions: !1,
                        elfRefresh: !1
                    }), t.data("refreshPositions", null)))
                },
                stop: function (e, t) {
                    var n, t = t.helper;
                    st(document).off(u), st(this).elfUiWidgetInstance("draggable") && st(this).draggable("option", {
                        refreshPositions: !1
                    }), F.draggingUiHelper = null, F.trigger("focus").trigger("dragstop"), t.data("droped") || (n = st.grep(t.data("files") || [], function (e) {
                        return !!e
                    }), F.trigger("unlockfiles", {
                        files: n
                    }), F.trigger("selectfiles", {
                        files: F.selected()
                    })), F.enable(), U.attr("style", p), t.data("autoScrTm") && clearInterval(t.data("autoScrTm"))
                },
                helper: function (e, t) {
                    function n(e) {
                        var t = e.mime,
                            n = F.tmb(e),
                            t = '<div class="elfinder-cwd-icon elfinder-cwd-icon-drag ' + F.mime2class(t) + ' ui-corner-all"></div>';
                        return n ? t = st(t).addClass(n.className).css("background-image", "url('" + n.url + "')").get(0).outerHTML : e.icon && (t = st(t).css(F.getIconStyle(e, !0)).get(0).outerHTML), t = e.csscls ? '<div class="' + e.csscls + '">' + t + "</div>" : t
                    }
                    var i, a, o = this.id ? st(this) : st(this).parents("[id]:first"),
                        r = st('<div class="elfinder-drag-helper"><span class="elfinder-drag-helper-icon-status"></span></div>');
                    return F.draggingUiHelper && F.draggingUiHelper.stop(!0, !0), F.trigger("dragstart", {
                        target: o[0],
                        originalEvent: e
                    }, !0), i = o.hasClass(F.res("class", "cwdfile")) ? F.selected() : [F.navId2Hash(o.attr("id"))], r.append(n(_[i[0]])).data("files", i).data("locked", !1).data("droped", !1).data("namespace", P).data("dropover", 0), 1 < (e = i.length) && r.append(n(_[i[e - 1]]) + '<span class="elfinder-drag-num">' + e + "</span>"), st(document).on(u, function (e) {
                        F._commands.copy && (e = e.shiftKey || e.ctrlKey || e.metaKey, a !== e && (a = e, r.is(":visible") && r.data("dropover") && !r.data("droped") && (r.toggleClass("elfinder-drag-helper-plus", !!r.data("locked") || a), F.trigger(a ? "unlockfiles" : "lockfiles", {
                            files: i,
                            helper: r
                        }))))
                    }), r
                }
            }, F.commands.getfile && ("function" == typeof F.options.getFileCallback ? (F.bind("dblclick", function (e) {
                e.preventDefault(), F.exec("getfile").fail(function () {
                    F.exec("open", e.data && e.data.file ? [e.data.file] : void 0)
                })
            }), F.shortcut({
                pattern: "enter",
                description: F.i18n("cmdgetfile"),
                callback: function () {
                    F.exec("getfile").fail(function () {
                        F.exec("mac" == F.OS ? "rename" : "open")
                    })
                }
            }).shortcut({
                pattern: "ctrl+enter",
                description: F.i18n("mac" == F.OS ? "cmdrename" : "cmdopen"),
                callback: function () {
                    F.exec("mac" == F.OS ? "rename" : "open")
                }
            })) : F.options.getFileCallback = null), st.each(F.commands, function (e, t) {
                var n, i = Object.assign({}, t.prototype);
                if ("function" == typeof t && !F._commands[e] && (t.prototype.forceLoad || -1 !== st.inArray(e, F.options.commands))) {
                    if (n = t.prototype.extendsCmd || "") {
                        if ("function" != typeof F.commands[n]) return !0;
                        t.prototype = Object.assign({}, ge, new F.commands[n], t.prototype)
                    } else t.prototype = Object.assign({}, ge, t.prototype);
                    F._commands[e] = new t, t.prototype = i, t = F.options.commandsOptions[e] || {}, n && F.options.commandsOptions[n] && (t = st.extend(!0, {}, F.options.commandsOptions[n], t)), F._commands[e].setup(e, t), F._commands[e].linkedCmds.length && st.each(F._commands[e].linkedCmds, function (e, t) {
                        var n = F.commands[t];
                        "function" != typeof n || F._commands[t] || (n.prototype = ge, F._commands[t] = new n, F._commands[t].setup(t, F.options.commandsOptions[t] || {}))
                    })
                }
            }), F.ui = {
                workzone: st("<div></div>").appendTo(U).elfinderworkzone(F),
                navbar: st("<div></div>").appendTo(U).elfindernavbar(F, F.options.uiOptions.navbar || {}),
                navdock: st("<div></div>").appendTo(U).elfindernavdock(F, F.options.uiOptions.navdock || {}),
                contextmenu: st("<div></div>").appendTo(U).elfindercontextmenu(F),
                overlay: st("<div></div>").appendTo(U).elfinderoverlay({
                    show: function () {
                        F.disable()
                    },
                    hide: function () {
                        de && F.enable()
                    }
                }),
                cwd: st("<div></div>").appendTo(U).elfindercwd(F, F.options.uiOptions.cwd || {}),
                notify: F.dialog("", {
                    cssClass: "elfinder-dialog-notify" + (F.options.notifyDialog.canClose ? "" : " elfinder-titlebar-button-hide"),
                    position: F.options.notifyDialog.position,
                    absolute: !0,
                    resizable: !1,
                    autoOpen: !1,
                    allowMinimize: !0,
                    closeOnEscape: !!F.options.notifyDialog.canClose,
                    title: "&nbsp;",
                    width: F.options.notifyDialog.width ? parseInt(F.options.notifyDialog.width) : null,
                    minHeight: null,
                    minimize: function () {
                        F.ui.notify.trigger("minimize")
                    }
                }),
                statusbar: st('<div class="ui-widget-header ui-helper-clearfix ui-corner-bottom elfinder-statusbar"></div>').hide().appendTo(U),
                toast: st('<div class="elfinder-toast"></div>').appendTo(U),
                bottomtray: st('<div class="elfinder-bottomtray">').appendTo(U),
                progressbar: st('<div class="elfinder-ui-progressbar">').appendTo(U)
            }, F.trigger("uiready"), st.each(F.options.ui || [], function (e, t) {
                var n = "elfinder" + t,
                    i = F.options.uiOptions[t] || {};
                !F.ui[t] && st.fn[n] && (F.ui[t] = st("<" + (i.tag || "div") + "/>").appendTo(U), F.ui[t][n](F, i))
            }), F.ui.progressbar.appendTo(F.ui.workzone), F.ui.notify.prev(".ui-dialog-titlebar").append('<div class="elfinder-ui-progressbar"></div>'), F.resize(ve, be), F.options.resizable && (U.resizable({
                resize: function (e, t) {
                    F.resize(t.size.width, t.size.height)
                },
                handles: "se",
                minWidth: 300,
                minHeight: 200
            }), F.UA.Touch && U.addClass("touch-punch")), n = F.getUI("navbar"), i = F.getUI("cwd").parent(), F.autoScroll = {
                navbarUp: function (e) {
                    n.scrollTop(Math.max(0, n.scrollTop() - e))
                },
                navbarDown: function (e) {
                    n.scrollTop(n.scrollTop() + e)
                },
                cwdUp: function (e) {
                    i.scrollTop(Math.max(0, i.scrollTop() - e))
                },
                cwdDown: function (e) {
                    i.scrollTop(i.scrollTop() + e)
                }
            }, F.UA.Touch && (y = F.getUI("navbar"), w = F.getUI("toolbar"), x = "touchmove.stopscroll", y = y.children().length ? y : null, w = w.length ? w : null, U.on("touchstart touchmove touchend", function (e) {
                if ("touchend" === e.type) return r = o = !1, void (v = setTimeout(function () {
                    U.off(x)
                }, 100));
                var t = e.originalEvent.touches || [{}],
                    n = t[0].pageX || null,
                    i = t[0].pageY || null,
                    a = "ltr" === F.direction;
                null === n || null === i || "touchstart" === e.type && 1 < t.length || ("touchstart" === e.type ? (h = U.offset(), f = U.width(), y && (o = !1, y.is(":hidden") ? (b = b || Math.max(50, f / 10), (a ? n - h.left : f + h.left - n) < b && (o = n)) : e.originalEvent._preventSwipeX || (m = y.width(), t = a ? n < h.left + m : n > h.left + f - m, o = !!t && (b = Math.max(50, f / 10), n))), w && (r = !1, e.originalEvent._preventSwipeY || (g = w.height(), i - h.top < (w.is(":hidden") ? 50 : g + 30) && (r = i, U.on(x, w.is(":hidden") ? I : O))))) : (y && !1 !== o && (t = (a ? n < o : o < n) ? "navhide" : "navshow", e = Math.abs(o - n), ("navhide" == t && .6 * m < e || ("navhide" == t ? m / 3 : 45) < e && ("navshow" == t || (a ? n < h.left + 20 : n > h.left + f - 20))) && (F.getUI("navbar").trigger(t, {
                    handleW: b
                }), o = !1)), w && !1 !== r && (e = w.offset().top, Math.abs(r - i) > Math.min(45, g / 3) && ("slideDown" == (a = i < r ? "slideUp" : "slideDown") || i < e + 20) && (w.is("slideDown" == a ? ":hidden" : ":visible") && w.stop(!0, !0).trigger("toggle", {
                    duration: 100,
                    handleH: 50
                }), r = !1))))
            })), F.dragUpload && (a = "native-drag-enter", z = "native-drag-disable", e = "class", T = F.res(e, "navdir"), F.res(e, "droppable"), F.res(e, "adroppable"), F.res(e, "navarrow"), A = F.res(e, "adroppable"), j = F.getUI("workzone"), S = "ltr" === F.direction, U.on("dragenter", function (e) {
                E(), M(e) && (e.preventDefault(), e.stopPropagation(), k = j.data("rectangle"))
            }).on("dragleave", function (e) {
                E(), M(e) && (e.preventDefault(), e.stopPropagation())
            }).on("dragover", function (i) {
                var a;
                M(i) ? (i.preventDefault(), i.stopPropagation(), i.originalEvent.dataTransfer.dropEffect = "none", C = C || requestAnimationFrame(function () {
                    var e, t = k.top + k.height,
                        n = t - F.getUI("navdock").outerHeight(!0);
                    ((a = i.pageY < k.top) || i.pageY > n) && (e = k.cwdEdge > i.pageX ? (S ? "navbar" : "cwd") + (a ? "Up" : "Down") : (S ? "cwd" : "navbar") + (a ? "Up" : "Down"), a || "cwd" === e.substr(0, 3) && (t < i.pageY ? n = t : e = ""), e && F.autoScroll[e](Math.pow(a ? k.top - i.pageY : i.pageY - n, 1.3))), C = null
                })) : E()
            }).on("drop", function (e) {
                E(), M(e) && (e.stopPropagation(), e.preventDefault())
            }), U.on("dragenter", ".native-droppable", function (e) {
                if (e.originalEvent.dataTransfer) {
                    var n, t = st(e.currentTarget),
                        i = null;
                    if (!(e.currentTarget.id || null)) {
                        i = F.cwd(), t.data(z, !1);
                        try {
                            st.each(e.originalEvent.dataTransfer.types, function (e, t) {
                                "elfinderfrom:" === t.substr(0, 13) && (n = t.substr(13).toLowerCase())
                            })
                        } catch (e) { }
                    }
                    i && (!i.write || n && n === (window.location.href + i.hash).toLowerCase()) ? t.data(z, !0) : (e.preventDefault(), e.stopPropagation(), t.data(a, !0), t.addClass(A))
                }
            }).on("dragleave", ".native-droppable", function (e) {
                var t;
                e.originalEvent.dataTransfer && (t = st(e.currentTarget), e.preventDefault(), e.stopPropagation(), t.data(a) ? t.data(a, !1) : t.removeClass(A))
            }).on("dragover", ".native-droppable", function (e) {
                var t;
                e.originalEvent.dataTransfer && (t = st(e.currentTarget), e.preventDefault(), e.stopPropagation(), e.originalEvent.dataTransfer.dropEffect = t.data(z) ? "none" : "copy", t.data(a, !1))
            }).on("drop", ".native-droppable", function (e) {
                var t;
                e.originalEvent && e.originalEvent.dataTransfer && (t = st(e.currentTarget), e.preventDefault(), e.stopPropagation(), t.removeClass(A), t = e.currentTarget.id ? t.hasClass(T) ? F.navId2Hash(e.currentTarget.id) : F.cwdId2Hash(e.currentTarget.id) : F.cwd().hash, e.originalEvent._target = t, F.exec("upload", {
                    dropEvt: e.originalEvent,
                    target: t
                }, void 0, t))
            })), !1 === F.cssloaded && (F.cssloaded = !0, F.trigger("cssloaded")), F.zIndexCalc(), void F.trigger("init").request({
                data: {
                    cmd: "open",
                    target: F.startDir(),
                    init: 1,
                    tree: 1
                },
                preventDone: !0,
                notify: {
                    type: "open",
                    cnt: 1,
                    hideCnt: !0
                },
                freeze: !0
            }).fail(function () {
                F.trigger("fail").disable().lastDir(""), N = {}, L = {}, st(document).add(U).off("." + P), F.trigger = function () { }
            }).done(function (e) {
                function n(e) {
                    var t = F.file(F.trashes[e]);
                    F.options.debug, t && t.volumeid && delete F.volOptions[t.volumeid].trashHash, F.trashes[e] = !1, F.debug("backend-error", 'Trash hash "' + e + '" was not found or not writable.')
                }
                var i = {};
                F.options.rawStringDecoder && F.registRawStringDecoder(F.options.rawStringDecoder), F.zIndexCalc(), F.load().debug("api", F.api), U.trigger("resize"), Ae(e), F.trigger("open", e, !1), F.trigger("opendone"), $ && F.options.enableAlways && st(window).trigger("focus"), st.each(F.trashes, function (e) {
                    var t = F.file(e);
                    t ? "directory" === t.mime && t.write || n(e) : i[e] = !0
                }), Object.keys(i).length && F.request({
                    data: {
                        cmd: "info",
                        targets: Object.keys(i)
                    },
                    preventDefault: !0
                }).done(function (e) {
                    e && e.files && st.each(e.files, function (e, t) {
                        "directory" === t.mime && t.write && delete i[t.hash]
                    })
                }).always(function () {
                    st.each(i, n)
                }), F[F.options.enableAlways ? "enable" : "disable"]()
            })) : alert(F.i18n("errURL")) : alert(F.i18n("errNode")) : alert(F.i18n("errJqui"));

            function O(e) {
                var t = (e.originalEvent.touches || [{}])[0].pageY || null;
                (!r || t < r) && (e.preventDefault(), v && clearTimeout(v))
            }

            function I(e) {
                e.preventDefault(), v && clearTimeout(v)
            }

            function M(e) {
                return "TEXTAREA" !== e.target.nodeName && "INPUT" !== e.target.nodeName && 0 === st(e.target).closest("div.ui-dialog-content").length
            }

            function E() {
                C && cancelAnimationFrame(C), C = null
            }
        }, n && "function" == typeof n && (F.bootCallback = n).call(U.get(0), F, {
            dfrdsBeforeBootup: ne
        }), st.when.apply(null, ne).done(function () {
            T()
        }).fail(function (e) {
            F.error(e)
        })
    }
    var a, o, r, s, l, c, n, i, d, p, u, h, f, m, g, v;
    if (void 0 !== (t = t || !1) && !t || (window.elFinder = Fe), Fe.prototype = {
        uniqueid: 0,
        res: function (e, t) {
            return this.resources[e] && this.resources[e][t]
        },
        OS: -1 !== navigator.userAgent.indexOf("Mac") ? "mac" : -1 !== navigator.userAgent.indexOf("Win") ? "win" : "other",
        UA: (t = !document.unqueID && !window.opera && !window.sidebar && "localStorage" in window && "WebkitAppearance" in document.documentElement.style, n = t && window.chrome, {
            ltIE6: void 0 === window.addEventListener && void 0 === document.documentElement.style.maxHeight,
            ltIE7: void 0 === window.addEventListener && void 0 === document.querySelectorAll,
            ltIE8: void 0 === window.addEventListener && void 0 === document.getElementsByClassName,
            ltIE9: document.uniqueID && document.documentMode <= 9,
            ltIE10: document.uniqueID && document.documentMode <= 10,
            gtIE11: document.uniqueID && 11 <= document.documentMode,
            IE: document.uniqueID,
            Firefox: window.sidebar,
            Opera: window.opera,
            Webkit: t,
            Chrome: n,
            Edge: !(!n || !window.msCredentials),
            Safari: t && !window.chrome,
            Mobile: void 0 !== window.orientation,
            Touch: void 0 !== window.ontouchstart,
            iOS: navigator.platform.match(/^iP(?:[ao]d|hone)/),
            Mac: navigator.platform.match(/^Mac/),
            Fullscreen: void 0 !== (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen),
            Angle: 0,
            Rotated: !1,
            CSS: (n = document.createElement("a").style, t = document.createElement("p").style, n.cssText = "position:sticky;position:-webkit-sticky;width:-webkit-max-content;width:-moz-max-content;width:-ms-max-content;width:max-content;", {
                positionSticky: -1 !== n.position.indexOf("sticky"),
                widthMaxContent: -1 !== n.width.indexOf("max-content"),
                flex: void 0 !== t.flex
            })
        }),
        cookieEnabled: window.navigator.cookieEnabled,
        hasRequire: "function" == typeof define && define.amd,
        currentReqCmd: "",
        keyState: {},
        i18: {
            en: {
                translator: "",
                language: "English",
                direction: "ltr",
                dateFormat: "d.m.Y H:i",
                fancyDateFormat: "$1 H:i",
                nonameDateFormat: "ymd-His",
                messages: {}
            },
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["msJan", "msFeb", "msMar", "msApr", "msMay", "msJun", "msJul", "msAug", "msSep", "msOct", "msNov", "msDec"],
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        },
        kinds: {
            unknown: "Unknown",
            directory: "Folder",
            group: "Selects",
            symlink: "Alias",
            "symlink-broken": "AliasBroken",
            "application/x-empty": "TextPlain",
            "application/postscript": "Postscript",
            "application/vnd.ms-office": "MsOffice",
            "application/msword": "MsWord",
            "application/vnd.ms-word": "MsWord",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "MsWord",
            "application/vnd.ms-word.document.macroEnabled.12": "MsWord",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.template": "MsWord",
            "application/vnd.ms-word.template.macroEnabled.12": "MsWord",
            "application/vnd.ms-excel": "MsExcel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "MsExcel",
            "application/vnd.ms-excel.sheet.macroEnabled.12": "MsExcel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.template": "MsExcel",
            "application/vnd.ms-excel.template.macroEnabled.12": "MsExcel",
            "application/vnd.ms-excel.sheet.binary.macroEnabled.12": "MsExcel",
            "application/vnd.ms-excel.addin.macroEnabled.12": "MsExcel",
            "application/vnd.ms-powerpoint": "MsPP",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation": "MsPP",
            "application/vnd.ms-powerpoint.presentation.macroEnabled.12": "MsPP",
            "application/vnd.openxmlformats-officedocument.presentationml.slideshow": "MsPP",
            "application/vnd.ms-powerpoint.slideshow.macroEnabled.12": "MsPP",
            "application/vnd.openxmlformats-officedocument.presentationml.template": "MsPP",
            "application/vnd.ms-powerpoint.template.macroEnabled.12": "MsPP",
            "application/vnd.ms-powerpoint.addin.macroEnabled.12": "MsPP",
            "application/vnd.openxmlformats-officedocument.presentationml.slide": "MsPP",
            "application/vnd.ms-powerpoint.slide.macroEnabled.12": "MsPP",
            "application/pdf": "PDF",
            "application/xml": "XML",
            "application/vnd.oasis.opendocument.text": "OO",
            "application/vnd.oasis.opendocument.text-template": "OO",
            "application/vnd.oasis.opendocument.text-web": "OO",
            "application/vnd.oasis.opendocument.text-master": "OO",
            "application/vnd.oasis.opendocument.graphics": "OO",
            "application/vnd.oasis.opendocument.graphics-template": "OO",
            "application/vnd.oasis.opendocument.presentation": "OO",
            "application/vnd.oasis.opendocument.presentation-template": "OO",
            "application/vnd.oasis.opendocument.spreadsheet": "OO",
            "application/vnd.oasis.opendocument.spreadsheet-template": "OO",
            "application/vnd.oasis.opendocument.chart": "OO",
            "application/vnd.oasis.opendocument.formula": "OO",
            "application/vnd.oasis.opendocument.database": "OO",
            "application/vnd.oasis.opendocument.image": "OO",
            "application/vnd.openofficeorg.extension": "OO",
            "application/x-shockwave-flash": "AppFlash",
            "application/flash-video": "Flash video",
            "application/x-bittorrent": "Torrent",
            "application/javascript": "JS",
            "application/rtf": "RTF",
            "application/rtfd": "RTF",
            "application/x-font-ttf": "TTF",
            "application/x-font-otf": "OTF",
            "application/x-rpm": "RPM",
            "application/x-web-config": "TextPlain",
            "application/xhtml+xml": "HTML",
            "application/docbook+xml": "DOCBOOK",
            "application/x-awk": "AWK",
            "application/x-gzip": "GZIP",
            "application/x-bzip2": "BZIP",
            "application/x-xz": "XZ",
            "application/zip": "ZIP",
            "application/x-zip": "ZIP",
            "application/x-rar": "RAR",
            "application/x-tar": "TAR",
            "application/x-7z-compressed": "7z",
            "application/x-jar": "JAR",
            "text/plain": "TextPlain",
            "text/x-php": "PHP",
            "text/html": "HTML",
            "text/javascript": "JS",
            "text/css": "CSS",
            "text/rtf": "RTF",
            "text/rtfd": "RTF",
            "text/x-c": "C",
            "text/x-csrc": "C",
            "text/x-chdr": "CHeader",
            "text/x-c++": "CPP",
            "text/x-c++src": "CPP",
            "text/x-c++hdr": "CPPHeader",
            "text/x-shellscript": "Shell",
            "application/x-csh": "Shell",
            "text/x-python": "Python",
            "text/x-java": "Java",
            "text/x-java-source": "Java",
            "text/x-ruby": "Ruby",
            "text/x-perl": "Perl",
            "text/x-sql": "SQL",
            "text/xml": "XML",
            "text/x-comma-separated-values": "CSV",
            "text/x-markdown": "Markdown",
            "image/x-ms-bmp": "BMP",
            "image/jpeg": "JPEG",
            "image/gif": "GIF",
            "image/png": "PNG",
            "image/tiff": "TIFF",
            "image/x-targa": "TGA",
            "image/vnd.adobe.photoshop": "PSD",
            "image/xbm": "XBITMAP",
            "image/pxm": "PXM",
            "audio/mpeg": "AudioMPEG",
            "audio/midi": "AudioMIDI",
            "audio/ogg": "AudioOGG",
            "audio/mp4": "AudioMPEG4",
            "audio/x-m4a": "AudioMPEG4",
            "audio/wav": "AudioWAV",
            "audio/x-mp3-playlist": "AudioPlaylist",
            "video/x-dv": "VideoDV",
            "video/mp4": "VideoMPEG4",
            "video/mpeg": "VideoMPEG",
            "video/x-msvideo": "VideoAVI",
            "video/quicktime": "VideoMOV",
            "video/x-ms-wmv": "VideoWM",
            "video/x-flv": "VideoFlash",
            "video/x-matroska": "VideoMKV",
            "video/ogg": "VideoOGG"
        },
        mimeTypes: {},
        rules: {
            defaults: function (e) {
                return !(!e || e.added && !Array.isArray(e.added) || e.removed && !Array.isArray(e.removed) || e.changed && !Array.isArray(e.changed))
            },
            open: function (e) {
                return e && e.cwd && e.files && st.isPlainObject(e.cwd) && Array.isArray(e.files)
            },
            tree: function (e) {
                return e && e.tree && Array.isArray(e.tree)
            },
            parents: function (e) {
                return e && e.tree && Array.isArray(e.tree)
            },
            tmb: function (e) {
                return e && e.images && (st.isPlainObject(e.images) || Array.isArray(e.images))
            },
            upload: function (e) {
                return e && (st.isPlainObject(e.added) || Array.isArray(e.added))
            },
            search: function (e) {
                return e && e.files && Array.isArray(e.files)
            }
        },
        commands: {},
        cmdsToAdd: "archive duplicate extract mkdir mkfile paste rm upload",
        parseUploadData: function (e) {
            var t, n = this;
            if (!st.trim(e)) return {
                error: ["errResponse", "errDataEmpty"]
            };
            try {
                t = JSON.parse(e)
            } catch (e) {
                return {
                    error: ["errResponse", "errDataNotJSON"]
                }
            }
            return t = n.normalize(t), n.validResponse("upload", t) ? (t.removed = st.merge(t.removed || [], st.map(t.added || [], function (e) {
                return n.file(e.hash) ? e.hash : null
            })), t) : {
                error: t.norError || ["errResponse"]
            }
        },
        iframeCnt: 0,
        uploads: {
            xhrUploading: !1,
            failSyncTm: null,
            chunkfailReq: {},
            checkExists: function (r, s, l, c) {
                function d() {
                    for (var e = r.length; - 1 < --e;) r[e]._remove = !0
                }

                function p() {
                    e.resolve(h, f)
                }
                var u, e = st.Deferred(),
                    h = [],
                    f = {};
                return (2.1 <= l.api && "object" == typeof r[0] ? function () {
                    function a(n) {
                        var i = n == o.length - 1,
                            e = {
                                cssClass: "elfinder-confirm-upload",
                                title: l.i18n("cmdupload"),
                                text: ["errExists", t + o[n].name, "confirmRepl"],
                                all: !i,
                                accept: {
                                    label: "btnYes",
                                    callback: function (e) {
                                        i || e ? p() : a(++n)
                                    }
                                },
                                reject: {
                                    label: "btnNo",
                                    callback: function (e) {
                                        var t;
                                        if (e)
                                            for (t = o.length; n < t--;) r[o[t].i]._remove = !0;
                                        else r[o[n].i]._remove = !0;
                                        i || e ? p() : a(++n)
                                    }
                                },
                                cancel: {
                                    label: "btnCancel",
                                    callback: function () {
                                        d(), p()
                                    }
                                },
                                buttons: [{
                                    label: "btnBackup",
                                    cssClass: "elfinder-confirm-btn-backup",
                                    callback: function (e) {
                                        var t;
                                        if (e)
                                            for (t = o.length; n < t--;) h.push(o[t].name);
                                        else h.push(o[n].name);
                                        i || e ? p() : a(++n)
                                    }
                                }]
                            };
                        c || e.buttons.push({
                            label: "btnRename" + (i ? "" : "All"),
                            cssClass: "elfinder-confirm-btn-rename",
                            callback: function () {
                                h = null, p()
                            }
                        }), 0 < l.iframeCnt && delete e.reject, l.confirm(e)
                    }
                    var i = [],
                        o = [],
                        t = s !== l.cwd().hash ? l.path(s, !0) + l.option("separator", s) : "";
                    l.file(s).read ? (u = st.map(r, function (e, t) {
                        return !e.name || l.UA.iOS && "image.jpg" === e.name ? null : {
                            i: t,
                            name: e.name
                        }
                    }), l.request({
                        data: {
                            cmd: "ls",
                            target: s,
                            intersect: st.map(u, function (e) {
                                return e.name
                            })
                        },
                        notify: {
                            type: "preupload",
                            cnt: 1,
                            hideCnt: !0
                        },
                        preventDefault: !0
                    }).done(function (e) {
                        var t, n;
                        e && (e.error ? d() : l.options.overwriteUploadConfirm && l.option("uploadOverwrite", s) && e.list && (Array.isArray(e.list) ? i = e.list || [] : (t = [], i = st.map(e.list, function (e) {
                            return "string" == typeof e ? e : (t = t.concat(e), !1)
                        }), t.length && (i = i.concat(t)), f = e.list), (o = st.grep(u, function (e) {
                            return -1 !== st.inArray(e.name, i)
                        })).length && i.length && s == l.cwd().hash && (n = st.map(l.files(s), function (e) {
                            return e.name
                        }), st.grep(i, function (e) {
                            return -1 === st.inArray(e, n)
                        }).length && l.sync()))), 0 < o.length ? a(0) : p()
                    }).fail(function (e) {
                        d(), p(), e && l.error(e)
                    })) : p()
                } : p)(), e
            },
            checkFile: function (i, l, r) {
                if (i.checked || "files" == i.type) return i.files;
                var s, c, d, p, u, h, f, m, n, g;
                if ("data" == i.type) return s = st.Deferred(), c = st.Deferred(), d = [], p = [], u = 0, f = !(h = []), m = function (e) {
                    function a() {
                        --u < 1 && "pending" === c.state() && c.resolve()
                    }

                    function t(e) {
                        o && e.name.match(o) || (p.push(i.fullPath || ""), d.push(e)), a()
                    }

                    function n(e) {
                        function n() {
                            e.readEntries(function (e) {
                                if (f || !e.length) {
                                    for (var t = 0; t < i.length; t++) {
                                        if (f) {
                                            c.reject();
                                            break
                                        }
                                        m([i[t]])
                                    }
                                    a()
                                } else i = i.concat(Array.prototype.slice.call(e || [], 0)), n()
                            }, a)
                        }
                        var i = [];
                        n()
                    }
                    var i, o = l.options.folderUploadExclude[l.OS] || null,
                        r = e.length;
                    u++;
                    for (var s = 0; s < r; s++) {
                        if (f) {
                            c.reject();
                            break
                        } (i = e[s]) && (i instanceof File ? t(i) : i.isFile ? (u++, i.file(t, a)) : i.isDirectory && 2.1 <= l.api && (u++, h.push(i.fullPath), n(i.createReader())))
                    }
                    return a(), c
                }, g = st.map(i.files.items, function (e) {
                    return "file" === e.kind ? (e.getAsEntry ? e.getAsEntry() : e.webkitGetAsEntry()) || e.getAsFile() : null
                }), st.each(g, function (e, t) {
                    if (t.isDirectory) return !(n = !0)
                }), 0 < g.length ? (l.uploads.checkExists(g, r, l, n).done(function (a, o) {
                    var t = [];
                    l.options.overwriteUploadConfirm && l.option("uploadOverwrite", r) && (null === a && (i.overwrite = 0, a = []), g = st.grep(g, function (n) {
                        var i, e;
                        return n.isDirectory && a.length && -1 !== (e = st.inArray(n.name, a)) && (a.splice(e, 1), e = l.uniqueName(n.name + l.options.backupSuffix, null, ""), st.each(o, function (e, t) {
                            if (n.name == t) return i = e, !1
                        }), i = i || l.fileByName(n.name, r).hash, l.lockfiles({
                            files: [i]
                        }), e = l.request({
                            data: {
                                cmd: "rename",
                                target: i,
                                name: e
                            },
                            notify: {
                                type: "rename",
                                cnt: 1
                            }
                        }).fail(function () {
                            n._remove = !0, l.sync()
                        }).always(function () {
                            l.unlockfiles({
                                files: [i]
                            })
                        }), t.push(e)), !n._remove
                    })), st.when.apply(st, t).done(function () {
                        var e, t, n = +new Date;
                        0 < g.length ? (t = l.escape(g[0].name), 1 < g.length && (t += " ... " + g.length + l.i18n("items")), e = setTimeout(function () {
                            l.notify({
                                type: "readdir",
                                id: n,
                                cnt: 1,
                                hideCnt: !0,
                                msg: l.i18n("ntfreaddir") + " (" + t + ")",
                                cancel: function () {
                                    f = !0
                                }
                            })
                        }, l.options.notifyDelay), m(g).done(function () {
                            e && clearTimeout(e), l.notify({
                                type: "readdir",
                                id: n,
                                cnt: -1
                            }), f ? s.reject() : s.resolve([d, p, a, o, h])
                        }).fail(function () {
                            s.reject()
                        })) : s.reject()
                    })
                }), s.promise()) : s.reject();
                var a = [],
                    o = [],
                    e = i.files[0];
                if ("html" == i.type) {
                    var v, t = st("<html></html>").append(st.parseHTML(e.replace(/ src=/gi, " _elfsrc=")));
                    st("img[_elfsrc]", t).each(function () {
                        var e, t = st(this),
                            n = t.closest("a");
                        n && n.attr("href") && n.attr("href").match(/\.(?:jpe?g|gif|bmp|png)/i) && (e = n.attr("href")), (n = t.attr("_elfsrc")) && (e ? (-1 == st.inArray(e, a) && a.push(e), -1 == st.inArray(n, o) && o.push(n)) : -1 == st.inArray(n, a) && a.push(n)), 1 === a.length && a[0].match(/^data:image\/png/) && (i.clipdata = !0)
                    }), (v = st("a[href]", t)).each(function () {
                        var e, t, n;
                        (e = st(this).text()) && (t = st(this).attr("href"), (n = document.createElement("a")).href = t, (t = n).href && t.href.match(/^(?:ht|f)tp/i) && (1 === v.length || !t.pathname.match(/(?:\.html?|\/[^\/.]*)$/i) || st.trim(e).match(/\.[a-z0-9-]{1,10}$/i)) && -1 == st.inArray(t.href, a) && -1 == st.inArray(t.href, o) && a.push(t.href))
                    })
                } else
                    for (var b, y = /((?:ht|f)tps?:\/\/[-_.!~*\'()a-z0-9;/?:\@&=+\$,%#\*\[\]]+)/gi; b = y.exec(e);) b = b[1].replace(/&amp;/g, "&"), -1 == st.inArray(b, a) && a.push(b);
                return a
            },
            xhr: function (O, I) {
                function m(e) {
                    var t = st.Deferred();
                    return e.promise ? e.always(function (e) {
                        t.resolve(Array.isArray(e) && e.length ? (U ? e[0] : e)[0] : {})
                    }) : t.resolve(e.length ? (U ? e[0] : e)[0] : {}), t
                }

                function g() {
                    t && H.notifyWith(p, [{
                        cnt: p.data("cnt"),
                        progress: p.data("progress"),
                        total: p.data("total")
                    }])
                }
                var M = I || this,
                    a = M.getUI(),
                    E = new XMLHttpRequest,
                    D = null,
                    n = null,
                    v = null,
                    F = O.checked,
                    U = O.isDataType || "data" == O.type,
                    P = O.target || M.cwd().hash,
                    q = O.dropEvt || null,
                    G = O.extraData || null,
                    Y = -1 != M.option("uploadMaxConn", P),
                    R = Math.min(5, Math.max(1, M.option("uploadMaxConn", P))),
                    b = 1e4,
                    y = 30,
                    w = 0,
                    H = st.Deferred().fail(function (e) {
                        var t, n = M.parseError(e);
                        "userabort" === n && (t = !0, n = void 0), s && (M.uploads.xhrUploading || t) ? m(s).done(function (e) {
                            t || V(n, e), e._cid ? M.uploads.chunkfailReq[e._cid] || (M.uploads.chunkfailReq[e._cid] = !0, setTimeout(function () {
                                I.request({
                                    data: {
                                        cmd: "upload",
                                        target: P,
                                        chunk: e._chunk,
                                        cid: e._cid,
                                        upload: ["chunkfail"],
                                        mimes: "chunkfail"
                                    },
                                    options: {
                                        type: "post",
                                        url: M.uploadURL
                                    },
                                    preventDefault: !0
                                }).always(function () {
                                    delete M.uploads.chunkfailReq[e._chunk]
                                })
                            }, 1e3)) : (M.uploads.failSyncTm && clearTimeout(M.uploads.failSyncTm), M.uploads.failSyncTm = setTimeout(function () {
                                M.sync(P)
                            }, 1e3))
                        }) : V(n), t || M.sync(), M.uploads.xhrUploading = !1, s = null
                    }).done(function (e) {
                        M.uploads.xhrUploading = !1, s = null, e && (M.currentReqCmd = "upload", e.warning && V(e.warning), M.updateCache(e), e.removed && e.removed.length && M.remove(e), e.added && e.added.length && M.add(e), e.changed && e.changed.length && M.change(e), M.trigger("upload", e, !1), M.trigger("uploaddone"), e.toasts && Array.isArray(e.toasts) && st.each(e.toasts, function () {
                            this.msg && M.toast(this)
                        }), e.sync && M.sync(), e.debug && (M.responseDebug(e), I.debug("backend-debug", e)))
                    }).always(function () {
                        M.abortXHR(E), a.off("uploadabort", c), st(window).off("unload", c), D && clearTimeout(D), n && clearTimeout(n), v && clearTimeout(v), F && !O.multiupload && B() && M.notify({
                            type: "upload",
                            cnt: -N,
                            progress: 0,
                            size: 0
                        }), n && k && M.notify({
                            type: "chunkmerge",
                            cnt: -N
                        }), d && x.children(".elfinder-notify-chunkmerge").length && M.notify({
                            type: "chunkmerge",
                            cnt: -1
                        })
                    }),
                    _ = new FormData,
                    s = O.input ? O.input.files : M.uploads.checkFile(O, M, P),
                    N = (O.checked && U ? s[0] : s).length,
                    Q = !1,
                    o = 0,
                    r = 0,
                    l = 0,
                    t = !1,
                    x = M.ui.notify,
                    L = !0,
                    k = !1,
                    W = !1,
                    B = function () {
                        return t = !t && (p = x.children(".elfinder-notify-upload")).length ? !0 : t
                    },
                    c = function (e, t) {
                        W = !0, M.abortXHR(E, {
                            quiet: !0,
                            abort: !0
                        }), H.reject(t), B() && M.notify({
                            type: "upload",
                            cnt: -1 * p.data("cnt"),
                            progress: 0,
                            size: 0
                        })
                    },
                    $ = function (e, t) {
                        p.children(".elfinder-notify-cancel")[e ? "show" : "hide"](), L = e
                    },
                    Z = function (e) {
                        return e = e || l, setTimeout(function () {
                            t = !0, M.notify({
                                type: "upload",
                                cnt: N,
                                progress: o - r,
                                size: e,
                                cancel: function () {
                                    a.trigger("uploadabort", "userabort")
                                }
                            }), p = x.children(".elfinder-notify-upload"), r = o, O.multiupload ? L && $(!0) : $(L && o < e)
                        }, M.options.notifyDelay)
                    },
                    V = function (e, t, n) {
                        e && M.trigger("xhruploadfail", {
                            error: e,
                            file: t
                        }), n ? e && (i < M.options.maxErrorDialogs && (Array.isArray(e) ? K = K.concat(e) : K.push(e)), i++) : e ? M.error(e) : (K.length && (i >= M.options.maxErrorDialogs && (K = K.concat("moreErrors", i - M.options.maxErrorDialogs)), M.error(K)), K = [], i = 0)
                    },
                    K = [],
                    i = 0,
                    X = O.renames || null,
                    J = O.hashes || null,
                    d = !1,
                    p = st();
                if (a.one("uploadabort", c), st(window).one("unload." + I.namespace, c), d || (r = o), !U && !N) return H.reject(["errUploadNoFiles"]);
                E.addEventListener("error", function () {
                    0 == E.status ? W ? H.reject() : !U && O.files && st.grep(O.files, function (e) {
                        return !e.type && e.size === (M.UA.Safari ? 1802 : 0)
                    }).length ? H.reject(["errAbort", "errFolderUpload"]) : O.input && st.grep(O.input.files, function (e) {
                        return !e.type && e.size === (M.UA.Safari ? 1802 : 0)
                    }).length ? H.reject(["errUploadNoFiles"]) : w++ <= y ? (B() && r && M.notify({
                        type: "upload",
                        cnt: 0,
                        progress: 0,
                        size: r
                    }), M.abortXHR(E, {
                        quiet: !0
                    }), r = o = 0, setTimeout(function () {
                        var e;
                        W || (E.open("POST", M.uploadURL, !0), 2.1029 <= M.api && (e = (+new Date).toString(16) + Math.floor(1e3 * Math.random()).toString(16), "function" == typeof _.delete && _.delete("reqid"), _.append("reqid", e), E._requestId = e), E.send(_))
                    }, b)) : a.trigger("uploadabort", ["errAbort", "errTimeout"]) : a.trigger("uploadabort", "errConnect")
                }, !1), E.addEventListener("load", function (e) {
                    var t = E.status,
                        n = 0,
                        i = "";
                    if (M.setCustomHeaderByXhr(E), 400 <= t ? i = 500 < t ? "errResponse" : ["errResponse", "errServerError"] : E.responseText || (i = ["errResponse", "errDataEmpty"]), i && (a.trigger("uploadabort"), m(s || {}).done(function (e) {
                        return H.reject(e._cid ? null : i)
                    })), o = l, B() && (n = o - r) && (M.notify({
                        type: "upload",
                        cnt: 0,
                        progress: n,
                        size: 0
                    }), g()), (t = M.parseUploadData(E.responseText))._chunkmerged) return _ = new FormData, n = [{
                        _chunkmerged: t._chunkmerged,
                        _name: t._name,
                        _mtime: t._mtime
                    }], d = !0, a.off("uploadabort", c), v = setTimeout(function () {
                        M.notify({
                            type: "chunkmerge",
                            cnt: 1
                        })
                    }, M.options.notifyDelay), void (U ? f(n, s[1]) : f(n));
                    t._multiupload = !!O.multiupload, t.error ? (n = {
                        cmd: "upload",
                        err: t,
                        xhr: E,
                        rc: E.status
                    }, M.trigger("uploadfail", t), M.trigger("requestError", n), n._getEvent && n._getEvent().isDefaultPrevented() && (t.error = ""), t._chunkfailure || t._multiupload ? (W = !0, M.uploads.xhrUploading = !1, D && clearTimeout(D), p.length ? (M.notify({
                        type: "upload",
                        cnt: -N,
                        progress: 0,
                        size: 0
                    }), H.reject(t)) : H.reject()) : H.reject(t)) : H.resolve(t)
                }, !1), E.upload.addEventListener("loadstart", function (e) {
                    !d && e.lengthComputable && (o = e.loaded, w && (o = 0), l = e.total, o = o || parseInt(.05 * l), B() && (M.notify({
                        type: "upload",
                        cnt: 0,
                        progress: o - r,
                        size: O.multiupload ? 0 : l
                    }), r = o, g()))
                }, !1), E.upload.addEventListener("progress", function (e) {
                    var t;
                    e.lengthComputable && !d && E.readyState < 2 && (o = e.loaded, !O.checked && 0 < o && !D && (D = Z(E._totalSize - o)), l || (l = e.total, o = o || parseInt(.05 * l)), t = o - r, B() && .05 <= t / e.total && (M.notify({
                        type: "upload",
                        cnt: 0,
                        progress: t,
                        size: 0
                    }), r = o, g()), !k && l <= o && !Q && (k = !0, n = setTimeout(function () {
                        M.notify({
                            type: "chunkmerge",
                            cnt: N
                        })
                    }, M.options.notifyDelay)), L && !O.multiupload && l <= o && B() && $(!1))
                }, !1);
                var u, h, C, e, z, f = function (e, t) {
                    function n() {
                        M.uploads.xhrUploading ? setTimeout(n, 100) : (M.uploads.xhrUploading = !0, S(w, R))
                    }
                    var i, a, o, r, s, l, c, d, p, u, h, f, m, g, v, b = 0,
                        y = 1,
                        w = [],
                        x = 0,
                        k = N,
                        C = 0,
                        z = [],
                        T = (new Date).getTime().toString().substr(-9),
                        A = Math.min((I.uplMaxSize || 2097152) - 8190, I.options.uploadMaxChunkSize),
                        j = !Y && "",
                        S = function (t, e) {
                            var n, i, a, o = [];
                            if (!W) {
                                for (; t.length && o.length < e;) o.push(t.shift());
                                if (i = o.length)
                                    for (var r = i, s = 0; s < i && !W; s++) n = U ? o[s][0][0]._cid || null : o[s][0]._cid || null, a = !(!a && !n), g[n] ? m-- : I.exec("upload", {
                                        type: O.type,
                                        isDataType: U,
                                        files: o[s],
                                        checked: !0,
                                        target: P,
                                        dropEvt: q,
                                        renames: X,
                                        hashes: J,
                                        multiupload: !0,
                                        overwrite: 0 === O.overwrite ? 0 : void 0,
                                        clipdata: O.clipdata
                                    }, void 0, P).fail(function (e) {
                                        e && "No such command" === e && (W = !0, I.error(["errUpload", "errPerm"])), n && (g[n] = !0)
                                    }).always(function (e) {
                                        e && e.added && (h = st.merge(h, e.added)), m <= ++f && (I.trigger("multiupload", {
                                            added: h
                                        }), D && clearTimeout(D), B() && M.notify({
                                            type: "upload",
                                            cnt: -N,
                                            progress: 0,
                                            size: 0
                                        })), t.length ? S(t, 1) : (--r <= 1 && L && $(!1, a), H.resolve())
                                    })
                            } (o.length < 1 || W) && (W ? (D && clearTimeout(D), n && (g[n] = !0), H.reject()) : (H.resolve(), M.uploads.xhrUploading = !1))
                        };
                    if (!F && (U || "files" == O.type)) {
                        for ((i = I.option("uploadMaxSize", P)) || (i = 0), s = 0; s < e.length; s++) {
                            try {
                                a = (p = e[s]).size, !1 === j && (j = "", 2.1 <= M.api && ("slice" in p ? j = "slice" : "mozSlice" in p ? j = "mozSlice" : "webkitSlice" in p && (j = "webkitSlice")))
                            } catch (e) {
                                N--, k--;
                                continue
                            }
                            if (i && i < a || !j && I.uplMaxSize && a > I.uplMaxSize) V(["errUploadFile", p.name, "errUploadFileSize"], p, !0), N--, k--;
                            else if (p.type && !M.uploadMimeCheck(p.type, P)) V(["errUploadFile", p.name, "errUploadMime", "(" + p.type + ")"], p, !0), N--, k--;
                            else if (j && A < a) {
                                for (l = 0, c = A, d = -1, k = Math.floor((a - 1) / A), o = p.lastModified ? Math.round(p.lastModified / 1e3) : 0, r = O.clipdata ? I.date(I.nonameDateFormat) + ".png" : p.name, C += a, z[T] = 0; l < a;)(u = p[j](l, c))._chunk = r + "." + ++d + "_" + k + ".part", u._cid = T, u._range = l + "," + u.size + "," + a, u._mtime = o, z[T]++, b && x++, void 0 === w[x] && (w[x] = [], U && (w[x][0] = [], w[x][1] = [])), b = A, y = 1, U ? (w[x][0].push(u), w[x][1].push(t[s])) : w[x].push(u), c = (l = c) + A;
                                null == u ? (V(["errUploadFile", p.name, "errUploadFileSize"], p, !0), N--, k--) : (k += d, b = 0, y = 1, x++)
                            } else (I.uplMaxSize && b + a > I.uplMaxSize || y > I.uplMaxFile) && (b = 0, y = 1, x++), void 0 === w[x] && (w[x] = [], U && (w[x][0] = [], w[x][1] = [])), U ? (w[x][0].push(p), w[x][1].push(t[s])) : w[x].push(p), b += a, C += a, y++
                        }
                        if (K.length && V(), 0 == w.length) return !(O.checked = !0);
                        if (1 < w.length) return D = Z(C), h = [], f = 0, m = w.length, g = [], n(), !0;
                        U ? (e = w[0][0], t = w[0][1]) : e = w[0]
                    }
                    return F || (I.UA.Safari && O.files ? E._totalSize = C : D = Z(C)), F = !0, e.length || H.reject(["errUploadNoFiles"]), E.open("POST", M.uploadURL, !0), I.customHeaders && st.each(I.customHeaders, function (e) {
                        E.setRequestHeader(e, this)
                    }), I.xhrFields && st.each(I.xhrFields, function (e) {
                        e in E && (E[e] = this)
                    }), 2.1029 <= M.api && (v = (+new Date).toString(16) + Math.floor(1e3 * Math.random()).toString(16), _.append("reqid", v), E._requestId = v), _.append("cmd", "upload"), _.append(M.newAPI ? "target" : "current", P), X && X.length && (st.each(X, function (e, t) {
                        _.append("renames[]", t)
                    }), _.append("suffix", I.options.backupSuffix)), J && st.each(J, function (e, t) {
                        _.append("hashes[" + e + "]", t)
                    }), st.each(M.customData, function (e, t) {
                        _.append(e, t)
                    }), st.each(M.options.onlyMimes, function (e, t) {
                        _.append("mimes[]", t)
                    }), st.each(e, function (e, t) {
                        var n;
                        t._chunkmerged ? (_.append("chunk", t._chunkmerged), _.append("upload[]", t._name), _.append("mtime[]", t._mtime), O.clipdata && _.append("overwrite", 0), Q = !0) : (t._chunkfail ? (_.append("upload[]", "chunkfail"), _.append("mimes", "chunkfail")) : (O.clipdata ? t._chunk || (O.overwrite = 0, n = I.date(I.nonameDateFormat) + ".png") : t.name && (n = t.name, I.UA.iOS && (n.match(/^image\.jpe?g$/i) ? (O.overwrite = 0, n = I.date(I.nonameDateFormat) + ".jpg") : n.match(/^capturedvideo\.mov$/i) && (O.overwrite = 0, n = I.date(I.nonameDateFormat) + ".mov")), n = (t.webkitRelativePath || t.relativePath || t._relativePath || "").replace(/[^\/]+$/, "") + n), n ? _.append("upload[]", t, n) : _.append("upload[]", t)), t._chunk ? (_.append("chunk", t._chunk), _.append("cid", t._cid), _.append("range", t._range), _.append("mtime[]", t._mtime), Q = !0) : _.append("mtime[]", t.lastModified ? Math.round(t.lastModified / 1e3) : 0))
                    }), U && st.each(t, function (e, t) {
                        _.append("upload_path[]", t)
                    }), 0 === O.overwrite && _.append("overwrite", 0), q && _.append("dropWith", parseInt((q.altKey ? "1" : "0") + (q.ctrlKey ? "1" : "0") + (q.metaKey ? "1" : "0") + (q.shiftKey ? "1" : "0"), 2)), G && st.each(G, function (e, t) {
                        _.append(e, t)
                    }), E.send(_), !0
                };
                return U ? F ? f(s[0], s[1]) : s.done(function (a) {
                    X = [], (N = a[0].length) ? a[4] && a[4].length ? I.request({
                        data: {
                            cmd: "mkdir",
                            target: P,
                            dirs: a[4]
                        },
                        notify: {
                            type: "mkdir",
                            cnt: a[4].length
                        },
                        preventFail: !0
                    }).fail(function (e) {
                        "errCmdParams" === (e = e || ["errUnknown"])[0] ? R = 1 : (R = 0, H.reject(e))
                    }).done(function (n) {
                        var i = !1;
                        n.hashes || (n.hashes = {}), a[1] = st.map(a[1], function (e, t) {
                            return a[0][t]._relativePath = e.replace(/^\//, ""), "" === (e = e.replace(/\/[^\/]*$/, "")) ? P : n.hashes[e] || (i = !0, a[0][t]._remove = !0, null)
                        }), i && (a[0] = st.grep(a[0], function (e) {
                            return !e._remove
                        }))
                    }).always(function (e) {
                        R && (X = a[2], J = a[3], f(a[0], a[1]))
                    }) : (a[1] = st.map(a[1], function () {
                        return P
                    }), X = a[2], J = a[3], f(a[0], a[1])) : H.reject(["errUploadNoFiles"])
                }).fail(function () {
                    H.reject()
                }) : 0 < s.length ? O.clipdata || null != X ? f(s) || H.reject() : (u = [], h = [], C = I.options.folderUploadExclude[I.OS] || null, st.each(s, function (e, t) {
                    var n = t.webkitRelativePath || t.relativePath || "";
                    if (!n) return !1;
                    C && t.name.match(C) ? (t._remove = !0, n = void 0) : (n = "/" + n.replace(/\/[^\/]*$/, "").replace(/^\//, "")) && -1 === st.inArray(n, u) && (u.push(n), -1 !== (t = n.substr(1).indexOf("/")) && (t = n.substr(0, t + 1)) && -1 === st.inArray(t, u) && u.unshift(t)), h.push(n)
                }), X = [], J = {}, u.length ? (e = st.map(u, function (e) {
                    return -1 === e.substr(1).indexOf("/") ? {
                        name: e.substr(1)
                    } : null
                }), z = [], I.uploads.checkExists(e, P, I, !0).done(function (n, i) {
                    var a, o, r = [];
                    I.options.overwriteUploadConfirm && I.option("uploadOverwrite", P) && (z = st.map(e, function (e) {
                        return e._remove ? e.name : null
                    }), e = st.grep(e, function (e) {
                        return !e._remove
                    })), z.length && st.each(h.concat(), function (e, t) {
                        0 === st.inArray(t, z) && (s[e]._remove = !0, h[e] = void 0)
                    }), s = st.grep(s, function (e) {
                        return !e._remove
                    }), h = st.grep(h, function (e) {
                        return void 0 !== e
                    }), e.length ? (st.Deferred(), n.length ? st.each(n, function (e, t) {
                        a = I.uniqueName(t + I.options.backupSuffix, null, ""), st.each(i, function (e, t) {
                            if (n[0] == t) return o = e, !1
                        }), o = o || I.fileByName(n[0], P).hash, I.lockfiles({
                            files: [o]
                        }), r.push(I.request({
                            data: {
                                cmd: "rename",
                                target: o,
                                name: a
                            },
                            notify: {
                                type: "rename",
                                cnt: 1
                            }
                        }).fail(function (e) {
                            H.reject(e), I.sync()
                        }).always(function () {
                            I.unlockfiles({
                                files: [o]
                            })
                        }))
                    }) : r.push(null), st.when.apply(st, r).done(function () {
                        I.request({
                            data: {
                                cmd: "mkdir",
                                target: P,
                                dirs: u
                            },
                            notify: {
                                type: "mkdir",
                                cnt: u.length
                            },
                            preventFail: !0
                        }).fail(function (e) {
                            "errCmdParams" === (e = e || ["errUnknown"])[0] ? R = 1 : (R = 0, H.reject(e))
                        }).done(function (n) {
                            var i = !1;
                            n.hashes || (n.hashes = {}), h = st.map(h.concat(), function (e, t) {
                                return "/" === e ? P : n.hashes[e] || (i = !0, s[t]._remove = !0, null)
                            }), i && (s = st.grep(s, function (e) {
                                return !e._remove
                            }))
                        }).always(function (e) {
                            R && (U = !0, f(s, h) || H.reject())
                        })
                    })) : H.reject()
                })) : I.uploads.checkExists(s, P, I).done(function (e, t) {
                    I.options.overwriteUploadConfirm && I.option("uploadOverwrite", P) && (J = t, null === e ? O.overwrite = 0 : X = e, s = st.grep(s, function (e) {
                        return !e._remove
                    })), 0 < (N = s.length) && f(s) || H.reject()
                })) : H.reject(), H
            },
            iframe: function (n, e) {
                function t() {
                    s && clearTimeout(s), r && clearTimeout(r), o && l.notify({
                        type: "upload",
                        cnt: -a
                    }), setTimeout(function () {
                        f && st('<iframe src="javascript:false;"></iframe>').appendTo(h), h.remove(), m.remove()
                    }, 100)
                }
                var i, a, o, r, s, l = e || this,
                    c = n.input || !1,
                    d = !c && l.uploads.checkFile(n, l),
                    p = st.Deferred().fail(function (e) {
                        e && l.error(e)
                    }),
                    u = "iframe-" + e.namespace + ++l.iframeCnt,
                    h = st('<form action="' + l.uploadURL + '" method="post" enctype="multipart/form-data" encoding="multipart/form-data" target="' + u + '" style="display:none"><input type="hidden" name="cmd" value="upload" /></form>'),
                    f = this.UA.IE,
                    m = st('<iframe src="' + (f ? "javascript:false;" : "about:blank") + '" name="' + u + '" style="position:absolute;left:-1000px;top:-1000px" ></iframe>').on("load", function () {
                        m.off("load").on("load", function () {
                            t(), p.resolve()
                        }), r = setTimeout(function () {
                            o = !0, l.notify({
                                type: "upload",
                                cnt: a
                            })
                        }, l.options.notifyDelay), 0 < l.options.iframeTimeout && (s = setTimeout(function () {
                            t(), p.reject(["errConnect", "errTimeout"])
                        }, l.options.iframeTimeout)), h.submit()
                    }),
                    g = n.target || l.cwd().hash,
                    u = [],
                    v = [],
                    b = {};
                if (d && d.length) st.each(d, function (e, t) {
                    h.append('<input type="hidden" name="upload[]" value="' + t + '"/>')
                }), a = 1;
                else {
                    if (!(c && st(c).is(":file") && st(c).val())) return p.reject();
                    e.options.overwriteUploadConfirm && e.option("uploadOverwrite", g) && (i = c.files || [{
                        name: st(c).val().replace(/^(?:.+[\\\/])?([^\\\/]+)$/, "$1")
                    }], u.push(l.uploads.checkExists(i, g, l).done(function (e, t) {
                        b = t, null === e ? n.overwrite = 0 : (v = e, (a = st.grep(i, function (e) {
                            return !e._remove
                        }).length) != i.length && (a = 0))
                    }))), a = c.files ? c.files.length : 1, h.append(c)
                }
                return st.when.apply(st, u).done(function () {
                    if (a < 1) return p.reject();
                    h.append('<input type="hidden" name="' + (l.newAPI ? "target" : "current") + '" value="' + g + '"/>').append('<input type="hidden" name="html" value="1"/>').append('<input type="hidden" name="node" value="' + l.id + '"/>').append(st(c).attr("name", "upload[]")), 0 < v.length && (st.each(v, function (e, t) {
                        h.append('<input type="hidden" name="renames[]" value="' + l.escape(t) + '"/>')
                    }), h.append('<input type="hidden" name="suffix" value="' + e.options.backupSuffix + '"/>')), b && st.each(v, function (e, t) {
                        h.append('<input type="hidden" name="[' + e + ']" value="' + l.escape(t) + '"/>')
                    }), 0 === n.overwrite && h.append('<input type="hidden" name="overwrite" value="0"/>'), st.each(l.options.onlyMimes || [], function (e, t) {
                        h.append('<input type="hidden" name="mimes[]" value="' + l.escape(t) + '"/>')
                    }), st.each(l.customData, function (e, t) {
                        h.append('<input type="hidden" name="' + e + '" value="' + l.escape(t) + '"/>')
                    }), h.appendTo("body"), m.appendTo("body")
                }), p
            }
        },
        one: function (e, n, t) {
            var i = this,
                a = e.toLowerCase(),
                o = function (e, t) {
                    return i.toUnbindEvents[a] || (i.toUnbindEvents[a] = []), i.toUnbindEvents[a].push({
                        type: a,
                        callback: o
                    }), (n.done || n).apply(this, arguments)
                };
            return n.done && (o = {
                done: o
            }), this.bind(a, o, t)
        },
        localStorage: function (t, n) {
            var e, i, a, o, r = window.localStorage,
                s = "elfinder-" + (t || "") + this.id,
                l = window.location.pathname + "-elfinder-",
                c = this.id,
                d = [];
            if (void 0 === t) return a = l.length, o = -1 * c.length, st.each(r, function (e) {
                e.substr(0, a) === l && e.substr(o) === c && d.push(e)
            }), st.each(d, function (e, t) {
                r.removeItem(t)
            }), !0;
            if (t = l + t + c, null === n) return r.removeItem(t);
            if (void 0 === n && !(e = r.getItem(t)) && (i = r.getItem(s)) && (n = i, r.removeItem(s)), void 0 !== n) {
                "string" != (i = typeof n) && "number" != i && (n = JSON.stringify(n));
                try {
                    r.setItem(t, n)
                } catch (e) {
                    try {
                        r.clear(), r.setItem(t, n)
                    } catch (e) {
                        this.debug("error", e.toString())
                    }
                }
                e = r.getItem(t)
            }
            if (e && ("{" === e.substr(0, 1) || "[" === e.substr(0, 1))) try {
                return JSON.parse(e)
            } catch (e) { }
            return e
        },
        sessionStorage: function (t, n) {
            var i, e;
            try {
                i = window.sessionStorage
            } catch (e) { }
            if (i) {
                if (null === n) return i.removeItem(t);
                if (void 0 !== n) {
                    "string" != (e = typeof n) && "number" != e && (n = JSON.stringify(n));
                    try {
                        i.setItem(t, n)
                    } catch (e) {
                        try {
                            i.clear(), i.setItem(t, n)
                        } catch (e) {
                            this.debug("error", e.toString())
                        }
                    }
                }
                if ((e = i.getItem(t)) && ("{" === e.substr(0, 1) || "[" === e.substr(0, 1))) try {
                    return JSON.parse(e)
                } catch (e) { }
                return e
            }
        },
        cookie: function (e, t) {
            var n, i, a, o, r;
            if (e = "elfinder-" + e + this.id, void 0 === t) {
                if (this.cookieEnabled && document.cookie && "" != document.cookie)
                    for (i = document.cookie.split(";"), e += "=", a = 0; a < i.length; a++)
                        if (i[a] = st.trim(i[a]), i[a].substring(0, e.length) == e) {
                            if ("{" === (o = decodeURIComponent(i[a].substring(e.length))).substr(0, 1) || "[" === o.substr(0, 1)) try {
                                return JSON.parse(o)
                            } catch (e) { }
                            return o
                        } return null
            }
            if (!this.cookieEnabled) return "";
            if (n = Object.assign({}, this.options.cookie), null === t ? (t = "", n.expires = -1) : "string" != (r = typeof t) && "number" != r && (t = JSON.stringify(t)), "number" == typeof n.expires && ((r = new Date).setTime(r.getTime() + 864e5 * n.expires), n.expires = r), document.cookie = e + "=" + encodeURIComponent(t) + "; expires=" + n.expires.toUTCString() + (n.path ? "; path=" + n.path : "") + (n.domain ? "; domain=" + n.domain : "") + (n.secure ? "; secure" : "") + (n.samesite ? "; samesite=" + n.samesite : ""), t && ("{" === t.substr(0, 1) || "[" === t.substr(0, 1))) try {
                return JSON.parse(t)
            } catch (e) { }
            return t
        },
        startDir: function () {
            var e = window.location.hash;
            return e && e.match(/^#elf_/) ? e.replace(/^#elf_/, "") : this.options.startPathHash || this.lastDir()
        },
        lastDir: function (e) {
            return this.options.rememberLastDir ? this.storage("lastdir", e) : ""
        },
        _node: st("<span></c.length;>"),
        escape: function (e) {
            return this._node.text(e).html().replace(/"/g, "&quot;").replace(/'/g, "&#039;")
        },
        normalize: function (o) {
            function e(t, e, n) {
                var i, a, o, r = !e || t,
                    e = !!e && null;
                if (t && t.hash && t.name && t.mime) {
                    if ("application/x-empty" === t.mime && (t.mime = "text/plain"), (o = u.isRoot(t)) && !t.volumeid && u.debug("warning", "The volume root statuses requires `volumeid` property."), o || "directory" === t.mime) {
                        if (t.phash) {
                            if (t.phash === t.hash) return g = g.concat(['Parent folder of "$1" is itself.', t.name]), e;
                            if (o && t.volumeid && 0 === t.phash.indexOf(t.volumeid)) return g = g.concat(['Parent folder of "$1" is inner itself.', t.name]), e
                        }
                        t.volumeid && (i = t.volumeid, o && (t.phash && (u.leafRoots[t.phash] ? -1 === st.inArray(t.hash, u.leafRoots[t.phash]) && u.leafRoots[t.phash].push(t.hash) : u.leafRoots[t.phash] = [t.hash]), u.hasVolOptions = !0, u.volOptions[i] || (u.volOptions[i] = {
                            dispInlineRegex: u.options.dispInlineRegex
                        }), a = u.volOptions[i], t.options && Object.assign(a, t.options), t.disabled && (a.disabled = t.disabled, a.disabledFlip = u.arrayFlip(t.disabled, !0)), t.tmbUrl && (a.tmbUrl = t.tmbUrl), a.url && "/" !== a.url.substr(-1) && (a.url += "/"), f(a), a.trashHash && (!1 === u.trashes[a.trashHash] ? delete a.trashHash : u.trashes[a.trashHash] = t.hash), st.each(u.optionProperties, function (e) {
                            a[e] && (t[e] = a[e])
                        }), "cwd" !== n && (u.roots[i] = t.hash), t.expires && (u.volumeExpires[i] = t.expires)), d !== i && (d = i, c = u.option("i18nFolderName", i))), o && !t.i18 && (s = "volume_" + t.name, l = u.i18n(!1, s), s !== l && (t.i18 = l)), c && !t.i18 && (s = "folder_" + t.name, l = u.i18n(!1, s), s !== l && (t.i18 = l)), o && (n = u.storage("rootNames")) && (n[t.hash] && (t._name = t.name, t._i18 = t.i18, t.name = n[t.hash] = n[t.hash], delete t.i18), u.storage("rootNames", n)), u.trashes[t.hash] && (t.locked = !0)
                    } else {
                        if (h) try {
                            if (!h(t)) return e
                        } catch (e) {
                            u.debug(e)
                        }
                        0 == t.size && (t.mime = u.getMimetype(t.name, t.mime))
                    }
                    return t.options && (u.optionsByHashes[t.hash] = m(t.options)), delete t.options, r
                }
                return e
            }

            function t(e, a) {
                st.each(e, function (e, t) {
                    var n, i;
                    u.leafRoots[t.hash] && u.applyLeafRootStats(t), "change" !== a && t.phash && u.isRoot(t) && (n = u.file(t.phash)) && (u.applyLeafRootStats(n), o.changed ? (st.each(o.changed, function (e, t) {
                        if (t.hash === n.hash) return o.changed[e] = n, !(i = !0)
                    }), i || o.changed.push(n)) : o.changed = [n])
                })
            }
            var s, l, c, d, n, i, a, r, p, u = this,
                h = ((a = u.options.fileFilter) && ("function" == typeof a ? i = function (e) {
                    return a.call(u, e)
                } : a instanceof RegExp && (i = function (e) {
                    return a.test(e.name)
                })), i || null),
                f = function (n) {
                    var i;
                    n.uiCmdMap && (st.isPlainObject(n.uiCmdMap) && Object.keys(n.uiCmdMap).length ? (n.disabledFlip || (n.disabledFlip = {}), i = n.disabledFlip, st.each(n.uiCmdMap, function (e, t) {
                        "hidden" !== t || i[e] || (n.disabled.push(e), n.disabledFlip[e] = !0)
                    })) : delete n.uiCmdMap)
                },
                m = function (i) {
                    function n(e) {
                        var t = typeof e;
                        return t = "object" === t && Array.isArray(e) ? "array" : t
                    }
                    return st.each(u.optionProperties, function (e, t) {
                        void 0 !== t && i[e] && n(i[e]) !== n(t) && (i[e] = t)
                    }), i.disabled ? (i.disabledFlip = u.arrayFlip(i.disabled, !0), st.each(u.options.disabledCmdsRels, function (e, t) {
                        var n;
                        (n = i.disabledFlip[e] || (e = e.match(/^([^&]+)&([^=]+)=(.*)$/)) && i.disabledFlip[e[1]] && i[e[2]] == e[3] ? !0 : n) && st.each(t, function (e, t) {
                            i.disabledFlip[t] || (i.disabledFlip[t] = !0, i.disabled.push(t))
                        })
                    })) : i.disabledFlip = {}, i
                },
                g = [];
            if (o.customData && (!u.prevCustomData || JSON.stringify(o.customData) !== JSON.stringify(u.prevCustomData))) {
                u.prevCustomData = o.customData;
                try {
                    n = JSON.parse(o.customData), st.isPlainObject(n) && (u.prevCustomData = n, st.each(Object.keys(n), function (e, t) {
                        null === n[t] && (delete n[t], delete u.optsCustomData[t])
                    }), u.customData = Object.assign({}, u.optsCustomData, n))
                } catch (e) { }
            }
            return o.options && m(o.options), o.cwd && (o.cwd.volumeid && o.options && Object.keys(o.options).length && u.isRoot(o.cwd) && (u.hasVolOptions = !0, u.volOptions[o.cwd.volumeid] = o.options), o.cwd = e(o.cwd, !0, "cwd")), o.files && (o.files = st.grep(o.files, e)), o.tree && (o.tree = st.grep(o.tree, e)), o.added && (o.added = st.grep(o.added, e)), o.changed && (o.changed = st.grep(o.changed, e)), o.removed && o.removed.length && 2 === u.searchStatus.state && (o.removed = o.removed.concat((r = o.removed, p = [], st.each(u.files(), function (n, e) {
                st.each(u.parents(n), function (e, t) {
                    if (-1 !== st.inArray(t, r) && -1 === st.inArray(n, r)) return p.push(n), !1
                })
            }), p))), o.api && (o.init = !0), Object.keys(u.leafRoots).length && (o.files && t(o.files), o.tree && t(o.tree), o.added && t(o.added), o.changed && t(o.changed, "change")), o.cwd && o.cwd.options && o.options && Object.assign(o.options, m(o.cwd.options)), o.options && o.options.url && "/" !== o.options.url.substr(-1) && (o.options.url += "/"), g.length && (o.norError = ["errResponse"].concat(g)), o
        },
        setSort: function (e, t, n, i) {
            this.storage("sortType", this.sortType = this.sortRules[e] ? e : "name"), this.storage("sortOrder", this.sortOrder = /asc|desc/.test(t) ? t : "asc"), this.storage("sortStickFolders", (this.sortStickFolders = !!n) ? 1 : ""), this.storage("sortAlsoTreeview", (this.sortAlsoTreeview = !!i) ? 1 : ""), this.trigger("sortchange")
        },
        _sortRules: {
            name: function (e, t) {
                return Fe.prototype.naturalCompare(e.i18 || e.name, t.i18 || t.name)
            },
            size: function (e, t) {
                e = parseInt(e.size) || 0, t = parseInt(t.size) || 0;
                return e === t ? 0 : t < e ? 1 : -1
            },
            kind: function (e, t) {
                return Fe.prototype.naturalCompare(e.mime, t.mime)
            },
            date: function (e, t) {
                e = e.ts || e.date || 0, t = t.ts || t.date || 0;
                return e === t ? 0 : t < e ? 1 : -1
            },
            perm: function (e, t) {
                function n(e) {
                    return (e.write ? 2 : 0) + (e.read ? 1 : 0)
                }
                e = n(e), t = n(t);
                return e === t ? 0 : t < e ? 1 : -1
            },
            mode: function (e, t) {
                e = e.mode || e.perm || "", t = t.mode || t.perm || "";
                return Fe.prototype.naturalCompare(e, t)
            },
            owner: function (e, t) {
                e = e.owner || "", t = t.owner || "";
                return Fe.prototype.naturalCompare(e, t)
            },
            group: function (e, t) {
                e = e.group || "", t = t.group || "";
                return Fe.prototype.naturalCompare(e, t)
            }
        },
        sorters: {},
        naturalCompare: function (e, t) {
            var g = Fe.prototype.naturalCompare;
            return void 0 === g.loc && (g.loc = navigator.userLanguage || navigator.browserLanguage || navigator.language || "en-US"), void 0 === g.sort && (0 < "11".localeCompare("2", g.loc, {
                numeric: !0
            }) ? window.Intl && window.Intl.Collator ? g.sort = new Intl.Collator(g.loc, {
                numeric: !0
            }).compare : g.sort = function (e, t) {
                return e.localeCompare(t, g.loc, {
                    numeric: !0
                })
            } : (g.sort = function (e, t) {
                function n(e) {
                    return g.sort.insensitive && ("" + e).toLowerCase() || "" + e
                }
                var i, a, o, r = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
                    s = /(^[ ]*|[ ]*$)/g,
                    l = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
                    c = /^0x[0-9a-f]+$/i,
                    d = /^0/,
                    p = /^[\x01\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]/,
                    e = n(e).replace(s, "").replace(/^_/, "") || "",
                    t = n(t).replace(s, "").replace(/^_/, "") || "",
                    u = e.replace(r, "\0$1\0").replace(/\0$/, "").replace(/^\0/, "").split("\0"),
                    h = t.replace(r, "\0$1\0").replace(/\0$/, "").replace(/^\0/, "").split("\0"),
                    s = parseInt(e.match(c)) || 1 != u.length && e.match(l) && Date.parse(e),
                    r = parseInt(t.match(c)) || s && t.match(l) && Date.parse(t) || null;
                if (r) {
                    if (s < r) return -1;
                    if (r < s) return 1
                }
                for (var f = 0, m = Math.max(u.length, h.length); f < m; f++) {
                    if (i = !(u[f] || "").match(d) && parseFloat(u[f]) || u[f] || 0, a = !(h[f] || "").match(d) && parseFloat(h[f]) || h[f] || 0, isNaN(i) !== isNaN(a)) {
                        if (isNaN(i) && ("string" != typeof i || !i.match(p))) return 1;
                        if ("string" != typeof a || !a.match(p)) return -1
                    }
                    if (typeof (i = 0 === parseInt(i, 10) ? 0 : i) != typeof (a = 0 === parseInt(a, 10) ? 0 : a) && (i += "", a += ""), g.sort.insensitive && "string" == typeof i && "string" == typeof a && 0 !== (o = i.localeCompare(a, g.loc))) return o;
                    if (i < a) return -1;
                    if (a < i) return 1
                }
                return 0
            }, g.sort.insensitive = !0)), g.sort(e, t)
        },
        compare: function (e, t) {
            var n = this.sortType,
                i = "asc" == this.sortOrder,
                a = this.sortStickFolders,
                o = this.sortRules,
                r = o[n],
                s = "directory" == e.mime,
                l = "directory" == t.mime;
            if (a) {
                if (s && !l) return -1;
                if (!s && l) return 1
            }
            return a = i ? r(e, t) : r(t, e), "name" !== n && 0 === a ? i ? o.name(e, t) : o.name(t, e) : a
        },
        sortFiles: function (e) {
            return e.sort(this.compare)
        },
        notify: function (e) {
            function t() {
                function e() {
                    c.remove(), s.children(l.data("minimized") ? void 0 : ":visible").length || (l.data("minimized") ? l.data("minimized").hide() : s.elfinderdialog("close")), v()
                }
                var t = c.find(".elfinder-notify-progress");
                c._esc && st(document).off("keydown", c._esc), c.data("cur") < 100 ? t.animate({
                    width: "100%"
                }, 50, function () {
                    requestAnimationFrame(function () {
                        e()
                    })
                }) : e()
            }
            var i = this,
                n = e.type,
                a = e.id ? "elfinder-notify-" + e.id : "",
                o = this.i18n(void 0 !== e.msg ? e.msg : this.messages["ntf" + n] ? "ntf" + n : "ntfsmth"),
                r = this.arrayFlip(this.options.notifyDialog.hiddens || []),
                s = this.ui.notify,
                l = s.closest(".ui-dialog"),
                c = s.children(".elfinder-notify-" + n + (a ? "." + a : "")),
                d = c.children("div.elfinder-notify-cancel").children("button"),
                a = '<div class="elfinder-notify elfinder-notify-{type}' + (a ? " " + a : "") + '"><span class="elfinder-dialog-icon elfinder-dialog-icon-{type}"></span><span class="elfinder-notify-msg">{msg}</span> <span class="elfinder-notify-cnt"></span><div class="elfinder-notify-progressbar"><div class="elfinder-notify-progress"></div></div><div class="elfinder-notify-cancel"></div></div>',
                p = e.cnt + 0,
                u = void 0 !== e.size ? parseInt(e.size) : null,
                h = void 0 !== e.progress && 0 <= e.progress ? e.progress : null,
                f = e.fakeinterval || 200,
                m = e.cancel,
                g = function (e) {
                    var t;
                    c.length && (t = c.data("cur") + 1) <= 98 && (c.find(".elfinder-notify-progress").width(t + "%"), c.data("cur", t), v(), setTimeout(function () {
                        g(e *= 1.05)
                    }, e))
                },
                v = function () {
                    var e = 0,
                        t = 0,
                        n = s.children(".elfinder-notify");
                    n.length ? (n.each(function () {
                        e++, t += Math.min(st(this).data("cur"), 100)
                    }), n = e ? Math.floor(t / (100 * e) * 100) + "%" : 0, i.ui.progressbar.width(n), l.data("minimized") && (l.data("minimized").title(n), l.data("minimized").dialog().children(".ui-dialog-titlebar").children(".elfinder-ui-progressbar").width(n))) : (i.ui.progressbar.width(0), l.data("minimized") && l.data("minimized").hide())
                };
            return n && (c.length ? void 0 !== e.msg && c.children("span.elfinder-notify-msg").html(o) : (c = st(a.replace(/\{type\}/g, n).replace(/\{msg\}/g, o)), r[n] ? c.hide() : s.on("minimize", function (e) {
                l.data("minimized") && v()
            }), c.appendTo(s).data("cnt", 0), null != h ? c.data({
                progress: 0,
                total: 0,
                cur: 0
            }) : (c.data({
                cur: 0
            }), g(f)), m && (d = st('<span class="elfinder-notify-button ui-icon ui-icon-close" title="' + this.i18n("btnCancel") + '"></span>').on("mouseenter mouseleave", function (e) {
                st(this).toggleClass("ui-state-hover", "mouseenter" === e.type)
            }), c.children("div.elfinder-notify-cancel").append(d)), s.trigger("resize")), 0 < (a = p + parseInt(c.data("cnt"))) ? (m && d.length && ("function" == typeof m || "object" == typeof m && m.promise) && (c._esc = function (e) {
                "keydown" == e.type && e.keyCode != st.ui.keyCode.ESCAPE || (e.preventDefault(), e.stopPropagation(), t(), m.promise ? m.reject(0) : m(e))
            }, d.on("click", function (e) {
                c._esc(e)
            }), st(document).on("keydown." + this.namespace, c._esc)), e.hideCnt || c.children(".elfinder-notify-cnt").text("(" + a + ")"), 0 < p && s.is(":hidden") && !r[n] && (l.data("minimized") ? l.data("minimized").show() : s.elfinderdialog("open", this).height("auto")), c.data("cnt", a), null != h && 0 <= (o = c.data("total")) && 0 <= (f = c.data("progress")) && (f += h, null == u && p < 0 && (f += 100 * p), c.data({
                progress: f,
                total: o += null != u ? u : p
            }), null != u && (f *= 100, o = Math.max(1, o)), h = Math.min(parseInt(f / o), 100), c.find(".elfinder-notify-progress").animate({
                width: (h < 100 ? h : 100) + "%"
            }, 20, function () {
                c.data("cur", h), v()
            }))) : t()), this
        },
        confirm: function (e) {
            var n, i, a = this,
                o = !1,
                r = {
                    cssClass: "elfinder-dialog-confirm",
                    modal: !0,
                    resizable: !1,
                    title: this.i18n(e.title || "confirmReq"),
                    buttons: {},
                    close: function () {
                        o || e.cancel.callback(), st(this).elfinderdialog("destroy")
                    }
                },
                t = this.i18n("apllyAll");
            return e.cssClass && (r.cssClass += " " + e.cssClass), r.buttons[this.i18n(e.accept.label)] = function () {
                e.accept.callback(!(!n || !n.prop("checked"))), o = !0, st(this).elfinderdialog("close")
            }, r.buttons[this.i18n(e.accept.label)]._cssClass = "elfinder-confirm-accept", e.reject && (r.buttons[this.i18n(e.reject.label)] = function () {
                e.reject.callback(!(!n || !n.prop("checked"))), o = !0, st(this).elfinderdialog("close")
            }, r.buttons[this.i18n(e.reject.label)]._cssClass = "elfinder-confirm-reject"), e.buttons && 0 < e.buttons.length && (i = 1, st.each(e.buttons, function (e, t) {
                r.buttons[a.i18n(t.label)] = function () {
                    t.callback(!(!n || !n.prop("checked"))), o = !0, st(this).elfinderdialog("close")
                }, r.buttons[a.i18n(t.label)]._cssClass = "elfinder-confirm-extbtn" + i++, t.cssClass && (r.buttons[a.i18n(t.label)]._cssClass += " " + t.cssClass)
            })), r.buttons[this.i18n(e.cancel.label)] = function () {
                st(this).elfinderdialog("close")
            }, r.buttons[this.i18n(e.cancel.label)]._cssClass = "elfinder-confirm-cancel", e.all && (r.create = function () {
                var e = st('<div class="elfinder-dialog-confirm-applyall"></div>');
                n = st('<input type="checkbox" />'), st(this).next().find(".ui-dialog-buttonset").prepend(e.append(st("<label>" + t + "</label>").prepend(n)))
            }), e.optionsCallback && "function" == typeof e.optionsCallback && e.optionsCallback(r), this.dialog('<span class="elfinder-dialog-icon elfinder-dialog-icon-confirm"></span>' + this.i18n(e.text), r)
        },
        uniqueName: function (e, t, n) {
            var i, a, o = 0,
                r = "";
            if (e = this.i18n(!1, e), t = t || this.cwd().hash, n = void 0 === n ? " " : n, (i = e.match(/^(.+)(\.[^.]+)$/)) && (r = i[2], e = i[1]), !this.fileByName(a = e + r, t)) return a;
            for (; o < 1e4;)
                if (a = e + n + ++o + r, !this.fileByName(a, t)) return a;
            return e + Math.random() + r
        },
        i18n: function () {
            function e(e) {
                var t;
                return 0 === e.indexOf("#") && (t = r.file(e.substr(1))) ? t.name : e
            }
            var i, t, n, a, o, r = this,
                s = this.messages,
                l = [],
                c = [],
                d = 0;
            for (arguments.length && !1 === arguments[0] && (a = function (e) {
                return e
            }, d = 1), i = d; i < arguments.length; i++)
                if (n = arguments[i], Array.isArray(n))
                    for (t = 0; t < n.length; t++) n[t] instanceof jQuery ? l.push(n[t]) : void 0 !== n[t] && l.push(e("" + n[t]));
                else n instanceof jQuery ? l.push(n[t]) : void 0 !== n && l.push(e("" + n));
            for (i = 0; i < l.length; i++) - 1 === st.inArray(i, c) && (n = "string" == typeof (n = l[i]) ? (o = !(!s[n] || !n.match(/^err/)), (n = s[n] || (a ? a(n) : r.escape(n))).replace(/\$(\d+)/g, function (e, t) {
                var n;
                return 0 < (t = i + parseInt(t)) && l[t] && c.push(t), n = a ? a(l[t]) : r.escape(l[t]), n = o ? '<span class="elfinder-err-var elfinder-err-var' + t + '">' + n + "</span>" : n
            })) : n.get(0).outerHTML, l[i] = n);
            return st.grep(l, function (e, t) {
                return -1 === st.inArray(t, c)
            }).join("<br>")
        },
        getIconStyle: function (n, i) {
            var a = this,
                o = "",
                r = {},
                s = 0;
            return n.icon && (o = 'style="', st.each({
                background: "url('{url}') 0 0 no-repeat",
                "background-size": "contain"
            }, function (e, t) {
                0 == s++ && (t = t.replace("{url}", a.escape(n.icon))), i ? r[e] = t : o += e + ":" + t + ";"
            }), o += '"'), i ? r : o
        },
        mime2class: function (e) {
            var t = "elfinder-cwd-icon-",
                e = e.toLowerCase(),
                n = this.textMimes[e],
                e = e.split("/");
            return n ? e[0] += " " + t + "text" : e[1] && e[1].match(/\+xml$/) && (e[0] += " " + t + "xml"), t + e[0] + (e[1] ? " " + t + e[1].replace(/(\.|\+)/g, "-") : "")
        },
        mime2kind: function (e) {
            var t, n = "object" == typeof e,
                i = n ? e.mime : e;
            return n && e.alias && "symlink-broken" != i ? t = "Alias" : this.kinds[i] ? t = !n || "directory" !== i || e.phash && !e.isroot ? this.kinds[i] : "Root" : this.mimeTypes[i] && (t = this.mimeTypes[i].toUpperCase(), this.messages["kind" + t] || (t = null)), t = t || (0 === i.indexOf("text") ? "Text" : 0 === i.indexOf("image") ? "Image" : 0 === i.indexOf("audio") ? "Audio" : 0 === i.indexOf("video") ? "Video" : 0 === i.indexOf("application") ? "App" : i), this.messages["kind" + t] ? this.i18n("kind" + t) : i
        },
        mimeIsText: function (e) {
            return !!(this.textMimes[e.toLowerCase()] || 0 === e.indexOf("text/") && "rtf" !== e.substr(5, 3) || e.match(/^application\/.+\+xml$/))
        },
        date: function (e, t) {
            var n, i, a, o, r, s, l, c, d = this;
            return t = t || new Date, r = t[d.getHours](), s = 12 < r ? r - 12 : r, l = t[d.getMinutes](), c = t[d.getSeconds](), n = t[d.getDate](), i = t[d.getDay](), a = t[d.getMonth]() + 1, o = t[d.getFullYear](), e.replace(/[a-z]/gi, function (e) {
                switch (e) {
                    case "d":
                        return 9 < n ? n : "0" + n;
                    case "j":
                        return n;
                    case "D":
                        return d.i18n(d.i18.daysShort[i]);
                    case "l":
                        return d.i18n(d.i18.days[i]);
                    case "m":
                        return 9 < a ? a : "0" + a;
                    case "n":
                        return a;
                    case "M":
                        return d.i18n(d.i18.monthsShort[a - 1]);
                    case "F":
                        return d.i18n(d.i18.months[a - 1]);
                    case "Y":
                        return o;
                    case "y":
                        return ("" + o).substr(2);
                    case "H":
                        return 9 < r ? r : "0" + r;
                    case "G":
                        return r;
                    case "g":
                        return s;
                    case "h":
                        return 9 < s ? s : "0" + s;
                    case "a":
                        return 12 <= r ? "pm" : "am";
                    case "A":
                        return 12 <= r ? "PM" : "AM";
                    case "i":
                        return 9 < l ? l : "0" + l;
                    case "s":
                        return 9 < c ? c : "0" + c
                }
                return e
            })
        },
        formatDate: function (e, t) {
            var n, i, a = this,
                t = t || e.ts;
            a.i18;
            return a.options.clientFormatDate && 0 < t ? (n = new Date(1e3 * t), i = t >= this.yesterday ? this.fancyFormat : this.dateFormat, i = a.date(i, n), t >= this.yesterday ? i.replace("$1", this.i18n(t >= this.today ? "Today" : "Yesterday")) : i) : e.date ? e.date.replace(/([a-z]+)\s/i, function (e, t) {
                return a.i18n(t) + " "
            }) : a.i18n("dateUnknown")
        },
        toLocaleString: function (e) {
            var t = new Number(e);
            return t ? t.toLocaleString ? t.toLocaleString() : String(e).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") : e
        },
        perms2class: function (e) {
            var t = "";
            return e.read || e.write ? e.read ? e.write || (t = "elfinder-ro") : t = "elfinder-wo" : t = "elfinder-na", e.type && (t += " elfinder-" + this.escape(e.type)), t
        },
        formatPermissions: function (e) {
            var t = [];
            return e.read && t.push(this.i18n("read")), e.write && t.push(this.i18n("write")), t.length ? t.join(" " + this.i18n("and") + " ") : this.i18n("noaccess")
        },
        formatSize: function (e) {
            var t = 1,
                n = "b";
            return "unknown" == e ? this.i18n("unknown") : (1073741824 < e ? (t = 1073741824, n = "GB") : 1048576 < e ? (t = 1048576, n = "MB") : 1024 < e && (t = 1024, n = "KB"), (0 < (e /= t) ? 1048576 <= t ? e.toFixed(2) : Math.round(e) : 0) + " " + n)
        },
        formatFileMode: function (e, t) {
            var n, i, a, o, r, s, l, c;
            if (t = t || this.options.fileModeStyle.toLowerCase(), (e = st.trim(e)).match(/[rwxs-]{9}$/i)) {
                if (l = e = e.substr(-9), "string" == t) return l;
                for (c = "", n = a = 0; n < 7; n += 3) o = 0, (i = e.substr(n, 3)).match(/[r]/i) && (o += 4), i.match(/[w]/i) && (o += 2), i.match(/[xs]/i) && (i.match(/[xs]/) && (o += 1), i.match(/[s]/i) && (0 == n ? a += 4 : 3 == n && (a += 2))), c += o.toString(8);
                a && (c = a.toString(8) + c)
            } else {
                if (c = (e = parseInt(e, 8)) ? e.toString(8) : "", !e || "octal" == t) return c;
                for (a = 0, 3 < (i = e.toString(8)).length && (i = i.substr(-4), a = parseInt(i.substr(0, 1), 8), i = i.substr(1)), s = 2 == (2 & a), r = 4 == (4 & a), l = "", n = 0; n < 3; n++) 4 == (4 & parseInt(i.substr(n, 1), 8)) ? l += "r" : l += "-", 2 == (2 & parseInt(i.substr(n, 1), 8)) ? l += "w" : l += "-", 1 == (1 & parseInt(i.substr(n, 1), 8)) ? l += 0 == n && r || 1 == n && s ? "s" : "x" : l += "-"
            }
            return "both" == t ? l + " (" + c + ")" : "string" == t ? l : c
        },
        registRawStringDecoder: function (e) {
            "function" == typeof e && (this.decodeRawString = this.options.rawStringDecoder = e)
        },
        uploadMimeCheck: function (i, e) {
            e = e || this.cwd().hash;

            function t(e) {
                var n = !1;
                return "string" == typeof e && "all" === e.toLowerCase() ? n = !0 : Array.isArray(e) && e.length && st.each(e, function (e, t) {
                    if ("all" === (t = t.toLowerCase()) || 0 === i.indexOf(t)) return !(n = !0)
                }), n
            }
            var n, a, o = !0,
                e = this.option("uploadMime", e);
            return i && st.isPlainObject(e) && (i = i.toLowerCase(), n = t(e.allow), a = t(e.deny), "allow" === e.firstOrder ? o = !a && !0 === n : (o = !0) !== a || n || (o = !1)), o
        },
        sequence: function (n) {
            function i(e, t) {
                return n[++t] ? i(e.then(n[t]), t) : e
            }
            var e = n.length;
            return 1 < e ? i(n[0](), 0) : n[0]()
        },
        reloadContents: function (n) {
            var t, i = st.Deferred();
            try {
                t = st('<iframe width="1" height="1" scrolling="no" frameborder="no" style="position:absolute; top:-1px; left:-1px" crossorigin="use-credentials">').attr("src", n).one("load", function () {
                    var t = st(this);
                    try {
                        this.contentDocument.location.reload(!0), t.one("load", function () {
                            t.remove(), i.resolve()
                        })
                    } catch (e) {
                        t.attr("src", "").attr("src", n).one("load", function () {
                            t.remove(), i.resolve()
                        })
                    }
                }).appendTo("body")
            } catch (e) {
                t && t.remove(), i.reject()
            }
            return i
        },
        makeNetmountOptionOauth: function (d, e, p, t) {
            function u(a, e, t) {
                var o = this,
                    n = Object.keys(st.isPlainObject(t) ? t : {}).length;
                e.next().remove(), n && (n = st('<select class="ui-corner-all elfinder-tabstop" style="max-width:200px;">').append(st(st.map(t, function (e, t) {
                    return '<option value="' + a.escape((t + "").trim()) + '">' + a.escape(e) + "</option>"
                }).join(""))).on("change click", function (e) {
                    var t, n = st(this),
                        i = n.val();
                    o.inputs.path.val(i), !h.folders || "change" !== e.type && n.data("current") === i || (n.next().remove(), n.data("current", i), i != h.root && (t = st('<div class="elfinder-netmount-spinner"></div>').append('<span class="elfinder-spinner"></span>'), r && "pending" === r.state() && a.abortXHR(r, {
                        quiet: !0,
                        abort: !0
                    }), n.after(t), r = a.request({
                        data: {
                            cmd: "netmount",
                            protocol: d,
                            host: p,
                            user: "init",
                            path: i,
                            pass: "folders"
                        },
                        preventDefault: !0
                    }).done(function (e) {
                        u.call(o, a, n, e.folders)
                    }).always(function () {
                        a.abortXHR(r, {
                            quiet: !0
                        }), t.remove()
                    }).xhr))
                }), e.after(st("<div></div>").append(n)).closest(".ui-dialog").trigger("tabstopsInit"), n.trigger("focus"))
            }
            var r, n = "boolean" == typeof t ? t : null,
                h = Object.assign({
                    noOffline: !1,
                    root: "root",
                    pathI18n: "folderId",
                    folders: !0
                }, null === n ? t || {} : {
                    noOffline: n
                });
            return {
                vars: {},
                name: e,
                inputs: {
                    offline: st('<input type="checkbox"/>').on("change", function () {
                        st(this).parents("table.elfinder-netmount-tb").find("select:first").trigger("change", "reset")
                    }),
                    host: st('<span><span class="elfinder-spinner"></span></span><input type="hidden"/>'),
                    path: st('<input type="text" value="' + h.root + '"/>'),
                    user: st('<input type="hidden"/>'),
                    pass: st('<input type="hidden"/>'),
                    mnt2res: st('<input type="hidden"/>')
                },
                select: function (n, e, t) {
                    var i = this.inputs,
                        a = i.offline,
                        o = st(i.host[0]),
                        t = t || null;
                    this.vars.mbtn = i.host.closest(".ui-dialog").children(".ui-dialog-buttonpane:first").find("button.elfinder-btncnt-0"), o.data("inrequest") || !o.find("span.elfinder-spinner").length && "reset" !== t && ("winfocus" !== t || o.siblings("span.elfinder-button-icon-reload").length) ? (a.closest("tr")[h.noOffline || i.user.val() ? "hide" : "show"](), o.data("funcexpup") && o.data("funcexpup")()) : (1 === a.parent().children().length && (i.path.parent().prev().html(n.i18n(h.pathI18n)), a.attr("title", n.i18n("offlineAccess")), a.uniqueId().after(st("<label></label>").attr("for", a.attr("id")).html(" " + n.i18n("offlineAccess")))), o.data("inrequest", !0).empty().addClass("elfinder-spinner").parent().find("span.elfinder-button-icon").remove(), n.request({
                        data: {
                            cmd: "netmount",
                            protocol: d,
                            host: p,
                            user: "init",
                            options: {
                                id: n.id,
                                offline: a.prop("checked") ? 1 : 0,
                                pass: i.host[1].value
                            }
                        },
                        preventDefault: !0
                    }).done(function (e) {
                        o.removeClass("elfinder-spinner").html(e.body.replace(/\{msg:([^}]+)\}/g, function (e, t) {
                            return n.i18n(t, p)
                        }))
                    }), h.noOffline && a.closest("tr").hide()), this.vars.mbtn[st(i.host[1]).val() ? "show" : "hide"]()
                },
                done: function (t, e) {
                    var n, i = this.inputs,
                        a = this.protocol,
                        o = st(i.host[0]),
                        r = st(i.host[1]),
                        s = "&nbsp;",
                        l = this.vars,
                        c = function () {
                            l.oauthW && !document.hasFocus() && --l.chkCnt && (a.trigger("change", "winfocus"), l.tm = setTimeout(c, 3e3))
                        };
                    if (h.noOffline && i.offline.closest("tr").hide(), "makebtn" == e.mode) o.removeClass("elfinder-spinner").removeData("expires").removeData("funcexpup"), n = i.host.find("input").on("mouseenter mouseleave", function () {
                        st(this).toggleClass("ui-state-hover")
                    }), e.url && n.on("click", function () {
                        l.tm && clearTimeout(l.tm), l.oauthW = window.open(e.url), (t.UA.iOS || t.UA.Mac) && t.isCORS && !l.chkdone && (l.chkCnt = 60, l.tm = setTimeout(c, 5e3))
                    }), r.val(""), i.path.val(h.root).next().remove(), i.user.val(""), i.pass.val(""), h.noOffline || i.offline.closest("tr").show(), l.mbtn.hide();
                    else if ("folders" == e.mode) e.folders && u.call(this, t, i.path.nextAll(":last"), e.folders);
                    else {
                        if (l.oauthW && (l.tm && clearTimeout(l.tm), l.oauthW.close(), delete l.oauthW, l.chkdone = !0), e.expires && (s = "()", o.data("expires", e.expires)), o.html(p + s).removeClass("elfinder-spinner"), e.expires && (o.data("funcexpup", function () {
                            var e = Math.floor((o.data("expires") - +new Date / 1e3) / 60);
                            e < 3 ? o.parent().children(".elfinder-button-icon-reload").click() : (o.text(o.text().replace(/\(.*\)/, "(" + t.i18n(["minsLeft", e]) + ")")), setTimeout(function () {
                                o.is(":visible") && o.data("funcexpup")()
                            }, 6e4))
                        }), o.data("funcexpup")()), e.reset) return void a.trigger("change", "reset");
                        o.parent().append(st('<span class="elfinder-button-icon elfinder-button-icon-reload" title="' + t.i18n("reAuth") + '">').on("click", function () {
                            r.val("reauth"), a.trigger("change", "reset")
                        })), r.val(d), l.mbtn.show(), e.folders && u.call(this, t, i.path, e.folders), e.mnt2res && i.mnt2res.val("1"), i.user.val("done"), i.pass.val("done"), i.offline.closest("tr").hide()
                    }
                    o.removeData("inrequest")
                },
                fail: function (e, t) {
                    st(this.inputs.host[0]).removeData("inrequest"), this.protocol.trigger("change", "reset")
                },
                integrateInfo: h.integrate
            }
        },
        findCwdNodes: function (e, n) {
            var i = this,
                a = (this.getUI("cwd"), this.cwd().hash),
                o = st();
            return n = n || {}, st.each(e, function (e, t) {
                if ((t.phash === a || 1 < i.searchStatus.state) && (o = o.add(i.cwdHash2Elm(t.hash)), n.firstOnly)) return !1
            }), o
        },
        convAbsUrl: function (e) {
            if (e.match(/^http/i)) return e;
            if ("//" === e.substr(0, 2)) return window.location.protocol + e;
            var t = window.location.protocol + "//" + window.location.host,
                n = /[^\/]+\/\.\.\//,
                i = "/" === e.substr(0, 1) ? t + e : t + window.location.pathname.replace(/\/[^\/]+$/, "/") + e;
            for (i = i.replace("/./", "/"); n.test(i);) i = i.replace(n, "");
            return i
        },
        isSameOrigin: function (e) {
            var t;
            if (e = this.convAbsUrl(e), location.origin && window.URL) try {
                return t = new URL(e), location.origin === t.origin
            } catch (e) { }
            return (t = document.createElement("a")).href = e, location.protocol === t.protocol && location.host === t.host && location.port && t.port
        },
        navHash2Id: function (e) {
            return this.navPrefix + e
        },
        navId2Hash: function (e) {
            return "string" == typeof e && e.substr(this.navPrefix.length)
        },
        cwdHash2Id: function (e) {
            return this.cwdPrefix + e
        },
        cwdId2Hash: function (e) {
            return "string" == typeof e && e.substr(this.cwdPrefix.length)
        },
        navHash2Elm: function (e) {
            return st(document.getElementById(this.navHash2Id(e)))
        },
        cwdHash2Elm: function (e) {
            return st(document.getElementById(this.cwdHash2Id(e)))
        },
        isInWindow: function (e, t) {
            return !!(e = e.get(0)) && (!(!t && null === e.offsetParent) && (t = e.getBoundingClientRect(), !!document.elementFromPoint(t.left, t.top)))
        },
        zIndexCalc: function () {
            var n = this,
                e = this.getUI(),
                t = e.css("z-index");
            t && "auto" !== t && "inherit" !== t ? n.zIndex = t : e.parents().each(function (e, t) {
                t = st(t).css("z-index");
                if ("auto" !== t && "inherit" !== t && (t = parseInt(t))) return n.zIndex = t, !1
            })
        },
        loadScript: function (i, a, o, r) {
            var s, l, e = {
                dataType: "script",
                cache: !0
            },
                c = {},
                d = {};
            return (o = o || {}).tryRequire && this.hasRequire ? require(i, a, o.error) : (s = function () {
                var e, t, n;
                st.each(d, function (e, t) {
                    if ("success" !== t && "notmodified" !== t) return !(n = !0)
                }), n ? o.error && "function" == typeof o.error && o.error({
                    loadResults: d
                }) : "function" == typeof a && (r && void 0 === r.obj[r.name] ? (e = r.timeout ? r.timeout / 10 : 1, t = setInterval(function () {
                    (--e < 0 || void 0 !== r.obj[r.name]) && (clearInterval(t), a())
                }, 10)) : a())
            }, "tag" === o.loadType ? (st("head > script").each(function () {
                c[this.src] = this
            }), l = i.length, st.each(i, function (t, e) {
                var n, i = !1;
                c[e] ? (d[t] = c[e]._error || "success", --l < 1 && s()) : ((n = document.createElement("script")).charset = o.charset || "UTF-8", st("head").append(n), n.onload = n.onreadystatechange = function () {
                    i || this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || (i = !0, d[t] = "success", --l < 1 && s())
                }, n.onerror = function (e) {
                    d[t] = n._error = e && e.type ? e.type : "error", --l < 1 && s()
                }, n.src = e)
            })) : (o = st.isPlainObject(o) ? Object.assign(e, o) : e, l = 0, function e(t, n) {
                void 0 !== t && (d[l++] = n), i.length ? st.ajax(Object.assign({}, o, {
                    url: i.shift(),
                    success: e,
                    error: e
                })) : s()
            }())), this
        },
        loadCss: function (e, t) {
            var i, a, o = this;
            return t && (t.className && (i = t.className), t.dfd && t.dfd.promise && (a = [])), st.each(e = "string" == typeof e ? [e] : e, function (e, t) {
                var n;
                t = o.convAbsUrl(t).replace(/^https?:/i, ""), a && (a[e] = st.Deferred()), st('head > link[href="' + o.escape(t) + '"]').length ? a && a[e].resolve() : ((n = document.createElement("link")).type = "text/css", n.rel = "stylesheet", n.href = t, i && (n.className = i), a && (n.onload = function () {
                    a[e].resolve()
                }, n.onerror = function () {
                    a[e].reject()
                }), st("head").append(n))
            }), a && st.when.apply(null, a).done(function () {
                t.dfd.resolve()
            }).fail(function () {
                t.dfd.reject()
            }), this
        },
        asyncJob: function (i, e, t) {
            var a, o, r = st.Deferred(),
                s = !1,
                l = Object.assign({
                    interval: 0,
                    numPerOnce: 1
                }, t || {}),
                c = [],
                d = [],
                p = [];
            return r._abort = function (e) {
                o && clearTimeout(o), d = [], s = !0, "pending" === r.state() && r[e ? "resolve" : "reject"](c)
            }, r.fail(function () {
                r._abort()
            }).always(function () {
                r._abort = function () { }
            }), "function" == typeof i && Array.isArray(e) ? (d = e.concat(), a = function () {
                var e, t, n;
                if (!s) {
                    for (t = (p = d.splice(0, l.numPerOnce)).length, e = 0; e < t && !s; e++) null !== (n = i(p[e])) && c.push(n);
                    s || (d.length ? o = setTimeout(a, l.interval) : r.resolve(c))
                }
            }, d.length ? o = setTimeout(a, 0) : r.resolve(c)) : r.reject(), r
        },
        getSize: function (a) {
            var t, n, p = this,
                o = [],
                u = a.length,
                h = st.Deferred().fail(function () {
                    st.each(o, function (e, t) {
                        t && (t.syncOnFail && t.syncOnFail(!1), t.reject())
                    })
                }),
                i = function (e) {
                    var t = st.Deferred(),
                        n = p.file(e),
                        n = n ? n.phash : e;
                    return n && !p.file(n) ? p.request({
                        data: {
                            cmd: "parents",
                            target: n
                        },
                        preventFail: !0
                    }).done(function () {
                        p.one("parentsdone", function () {
                            t.resolve()
                        })
                    }).fail(function () {
                        t.resolve()
                    }) : t.resolve(), t
                };
            return p.autoSync("stop"), t = st.Deferred(), 0 < (n = Object.keys(p.leafRoots).length) ? st.each(p.leafRoots, function (e) {
                i(e).done(function () {
                    --n < 1 && t.resolve()
                })
            }) : t.resolve(), t.done(function () {
                var e = [],
                    n = {},
                    t = [],
                    i = [],
                    d = {};
                st.each(a, function () {
                    var i, a;
                    e.push.apply(e, (i = p.file(this), a = [], "directory" === i.mime && st.each(p.leafRoots, function (e, t) {
                        var n;
                        if (e === i.hash) a.push.apply(a, t);
                        else
                            for (n = (p.file(e) || {}).phash; n;) n === i.hash && a.push.apply(a, t), n = (p.file(n) || {}).phash
                    }), a))
                }), a.push.apply(a, e), st.each(a, function () {
                    var e = p.root(this),
                        t = p.file(this);
                    t && (t.sizeInfo || "directory" !== t.mime) ? i.push(st.Deferred().resolve(t.sizeInfo || {
                        size: t.size,
                        dirCnt: 0,
                        fileCnt: 1
                    })) : n[e] ? n[e].push(this.toString()) : n[e] = [this.toString()]
                }), st.each(n, function () {
                    var e = t.length;
                    1 === this.length && (d[e] = this[0]), t.push(p.request({
                        data: {
                            cmd: "size",
                            targets: this
                        },
                        preventDefault: !0
                    }))
                }), o.push.apply(o, t), t.push.apply(t, i), st.when.apply(st, t).fail(function () {
                    h.reject()
                }).done(function () {
                    function n(e, t) {
                        var n;
                        (n = p.file(e)) && (n.sizeInfo = {
                            isCache: !0
                        }, st.each(["size", "dirCnt", "fileCnt"], function () {
                            n.sizeInfo[this] = t[this] || 0
                        }), n.size = parseInt(n.sizeInfo.size), l.push(n))
                    }
                    for (var e, t = 0, i = 0, a = 0, o = arguments.length, r = [], s = "", l = [], c = 0; c < o; c++)(e = arguments[c]).isCache || (d[c] && p.file(d[c]) ? n(d[c], e) : e.sizes && st.isPlainObject(e.sizes) && st.each(e.sizes, function (e, t) {
                        n(e, t)
                    })), t += parseInt(e.size), !1 !== i && (void 0 === e.fileCnt ? i = !1 : i += parseInt(e.fileCnt || 0)), !1 !== a && (void 0 === e.dirCnt ? a = !1 : a += parseInt(e.dirCnt || 0));
                    l.length && p.change({
                        changed: l
                    }), !1 !== a && r.push(p.i18n("folders") + ": " + (a - (1 < u ? 0 : 1))), !1 !== i && r.push(p.i18n("files") + ": " + i), r.length && (s = "<br>" + r.join(", ")), h.resolve({
                        size: t,
                        fileCnt: i,
                        dirCnt: a,
                        formated: (0 <= t ? p.formatSize(t) : p.i18n("unknown")) + s
                    })
                }), p.autoSync()
            }), h
        },
        wkObjUrl: null,
        getWorker: function (e) {
            var t;
            try {
                this.wkObjUrl || (this.wkObjUrl = (window.URL || window.webkitURL).createObjectURL(new Blob([function () {
                    self.onmessage = function (e) {
                        var t = e.data;
                        try {
                            if (self.data = t.data, t.scripts)
                                for (var n = 0; n < t.scripts.length; n++) importScripts(t.scripts[n]);
                            self.postMessage(self.res)
                        } catch (e) {
                            self.postMessage({
                                error: e.toString()
                            })
                        }
                    }
                }.toString().replace(/\s+/g, " ").replace(/ *([^\w]) */g, "$1").replace(/^function\b.+?\{|\}$/g, "")], {
                    type: "text/javascript"
                }))), t = new Worker(this.wkObjUrl, e)
            } catch (e) {
                this.debug("error", e.toString())
            }
            return t
        },
        getWorkerUrl: function (e) {
            return this.convAbsUrl(this.workerBaseUrl + e)
        },
        getTheme: function (t) {
            var n, i, a = this,
                o = st.Deferred(),
                r = function (e, t) {
                    return t = t || a.convAbsUrl(a.baseUrl), Array.isArray(e) ? st.map(e, function (e) {
                        return r(e, t)
                    }) : e.match(/^(?:http|\/\/)/i) ? e : t + e.replace(/^(?:\.\/|\/)/, "")
                };
            return t && (n = a.options.themes[t]) ? "string" == typeof n ? (url = r(n), (i = url.match(/^(.+\/)[^/]+\.json$/i)) ? st.getJSON(url).done(function (e) {
                (n = e).id = t, n.cssurls && (n.cssurls = r(n.cssurls, i[1])), o.resolve(n)
            }).fail(function () {
                o.reject()
            }) : o.resolve({
                id: t,
                name: t,
                cssurls: [url]
            })) : st.isPlainObject(n) && n.cssurls ? (n.id = t, n.cssurls = r(n.cssurls), Array.isArray(n.cssurls) || (n.cssurls = [n.cssurls]), n.name || (n.name = t), o.resolve(n)) : o.reject() : o.reject(), o
        },
        changeTheme: function (e) {
            var t = this;
            return e && (!t.options.themes[e] || t.theme && t.theme.id === e ? "default" === e && t.theme && "default" !== t.theme.id && (st("head>link.elfinder-theme-ext").remove(), t.theme = null, t.trigger && t.trigger("themechange")) : t.getTheme(e).done(function (e) {
                e.cssurls && (st("head>link.elfinder-theme-ext").remove(), t.loadCss(e.cssurls, {
                    className: "elfinder-theme-ext",
                    dfd: st.Deferred().done(function () {
                        t.theme = e, t.trigger && t.trigger("themechange")
                    })
                }))
            })), this
        },
        applyLeafRootStats: function (t, e) {
            var n = this,
                i = !e && n.file(t.hash) || t,
                a = i.ts,
                o = !1;
            return !e && t._realStats || (t._realStats = {
                locked: t.locked || 0,
                dirs: t.dirs || 0,
                ts: t.ts
            }), t.locked = 1, i.locked || (o = !0), t.dirs = 1, i.dirs || (o = !0), st.each(n.leafRoots[t.hash], function () {
                var e = n.file(this);
                e && e.ts && (t.ts || 0) < e.ts && (t.ts = e.ts)
            }), o = a !== t.ts ? !0 : o
        },
        abortXHR: function (e, t) {
            t = t || {};
            e && (t.quiet && (e.quiet = !0), t.abort && e._requestId && this.request({
                data: {
                    cmd: "abort",
                    id: e._requestId
                },
                preventDefault: !0
            }), e.abort())
        },
        setCustomHeaderByXhr: function (i) {
            var a = this;
            i.getResponseHeader && a.parrotHeaders && a.parrotHeaders.length && st.each(a.parrotHeaders, function (e, t) {
                var n = i.getResponseHeader(t);
                n ? (a.customHeaders[t] = n, a.sessionStorage("core-ph:" + t, n)) : "string" == typeof n && (delete a.customHeaders[t], a.sessionStorage("core-ph:" + t, null))
            })
        },
        hasParrotHeaders: function () {
            var e = !1,
                t = this.parrotHeaders;
            if (Object.keys(this.customHeaders).length)
                for (var n = 0; n < t.length; n++)
                    if (this.customHeaders[t[n]]) {
                        e = !0;
                        break
                    } return e
        },
        getRequestId: function () {
            return (+new Date).toString(16) + Math.floor(1e3 * Math.random()).toString(16)
        },
        arrayFlip: function (e, t) {
            var n, i = {},
                a = st.isArray(e);
            for (n in e) (a || e.hasOwnProperty(n)) && (i[e[n]] = t || n);
            return i
        },
        splitFileExtention: function (e) {
            var t;
            return (t = e.match(/^(.+?)?\.((?:tar\.(?:gz|bz|bz2|z|lzo))|cpio\.gz|ps\.gz|xcf\.(?:gz|bz2)|[a-z0-9]{1,10})$/i)) ? (void 0 === t[1] && (t[1] = ""), [t[1], t[2]]) : [e, ""]
        },
        sliceArrayBuffer: function (e, t) {
            for (var n = [], i = 0; i * t < e.byteLength;) n.push(e.slice(i * t, (i + 1) * t)), i++;
            return n
        },
        arrayBufferToBase64: function (e) {
            if (!window.btoa) return "";
            e = new Uint8Array(e), e = Array.prototype.slice.call(e).map(function (e) {
                return String.fromCharCode(e)
            });
            return window.btoa(e.join(""))
        },
        log: function (e) {
            return window.console && window.console.log && window.console.log(e), this
        },
        debug: function (e, t) {
            var n, i, a = this,
                o = this.options.debug,
                r = this.options.toastBackendWarn;
            return "backend-error" === e ? this.cwd().hash && (!o || "all" !== o && !o["backend-error"]) || (t = Array.isArray(t) ? t : [t], this.error(t)) : "backend-warning" === e ? (i = !0, r && (n = st.isPlainObject(r) ? r : {}, st.each(Array.isArray(t) ? t : [t], function (e, t) {
                a.toast(Object.assign({
                    mode: "warning",
                    msg: t
                }, n))
            }))) : "backend-debug" === e && this.trigger("backenddebug", t), (i || o && ("all" === o || o[e])) && window.console && window.console.log && window.console.log("elfinder debug: [" + e + "] [" + this.id + "]", t), this
        },
        responseDebug: function (e) {
            var t, e = e.debug;
            e && ((t = this.options.debug) && "all" === t || ((t = t || (this.options.debug = {}))["backend-error"] = !0, t.warning = !0), e.mountErrors && ("string" == typeof e.mountErrors || Array.isArray(e.mountErrors) && e.mountErrors.length) && this.debug("backend-error", e.mountErrors), e.backendErrors && ("string" == typeof e.backendErrors || Array.isArray(e.backendErrors) && e.backendErrors.length) && this.debug("backend-warning", e.backendErrors))
        },
        time: function (e) {
            window.console && window.console.time && window.console.time(e)
        },
        timeEnd: function (e) {
            window.console && window.console.timeEnd && window.console.timeEnd(e)
        }
    }, Object.keys || (Object.keys = (a = Object.prototype.hasOwnProperty, o = !{
        toString: null
    }.propertyIsEnumerable("toString"), s = (r = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"]).length, function (e) {
        if ("object" != typeof e && "function" != typeof e || null === e) throw new TypeError("Object.keys called on non-object");
        var t, n = [];
        for (t in e) a.call(e, t) && n.push(t);
        if (o)
            for (var i = 0; i < s; i++) a.call(e, r[i]) && n.push(r[i]);
        return n
    })), Array.isArray || (Array.isArray = function (e) {
        return jQuery.isArray(e)
    }), Object.assign || (Object.assign = function () {
        return jQuery.extend.apply(null, arguments)
    }), String.prototype.repeat || (String.prototype.repeat = function (e) {
        "use strict";
        if (null == this) throw new TypeError("can't convert " + this + " to object");
        var t = "" + this;
        if ((e = (e = +e) != e ? 0 : e) < 0) throw new RangeError("repeat count must be non-negative");
        if (e == 1 / 0) throw new RangeError("repeat count must be less than infinity");
        if (e = Math.floor(e), 0 == t.length || 0 == e) return "";
        if (1 << 28 <= t.length * e) throw new RangeError("repeat count must not overflow maximum string size");
        for (var n = "", i = 0; i < e; i++) n += t;
        return n
    }), String.prototype.trim || (String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "")
    }), ! function () {
        try {
            return Array.apply(null, {})
        } catch (e) { }
        var n = Object.prototype.toString,
            i = Function.prototype.apply,
            a = Array.prototype.slice;
        Function.prototype.apply = function (e, t) {
            return i.call(this, e, "[object Array]" === n.call(t) ? t : a.call(t))
        }
    }(), Array.from || (Array.from = function (e) {
        return 1 === e.length ? [e[0]] : Array.apply(null, e)
    }), !window.cancelAnimationFrame) {
        for (var b = 0, y = ["ms", "moz", "webkit", "o"], w = 0; w < y.length && !window.requestAnimationFrame; ++w) window.requestAnimationFrame = window[y[w] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[y[w] + "CancelAnimationFrame"] || window[y[w] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function (e, t) {
            var n = (new Date).getTime(),
                i = Math.max(0, 16 - (n - b)),
                a = window.setTimeout(function () {
                    e(n + i)
                }, i);
            return b = n + i, a
        }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function (e) {
            clearTimeout(e)
        })
    }

    function x(e, t) {
        var n, i;
        1 < e.originalEvent.touches.length || (c(e.currentTarget).hasClass("touch-punch-keep-default") || e.preventDefault(), n = e.originalEvent.changedTouches[0], (i = document.createEvent("MouseEvents")).initMouseEvent(t, !0, !0, window, 1, n.screenX, n.screenY, n.clientX, n.clientY, !1, !1, !1, !1, 0, null), e.target.dispatchEvent(i))
    }

    function k(e, t) {
        var n = 0;
        for (n in t)
            if (void 0 !== e[t[n]]) return t[n];
        return e[t[n]] = "", t[n]
    }
    return Fe.prototype.version = "2.1.65", st.ui && st.ui.ddmanager && (l = st.ui.ddmanager.prepareOffsets, st.ui.ddmanager.prepareOffsets = function (e, t) {
        if ("mousedown" === t.type || e.options.elfRefresh)
            for (var n, i = st.ui.ddmanager.droppables[e.options.scope] || [], a = i.length, o = 0; o < a; o++)(n = i[o]).options.autoDisable && (!n.options.disabled || 1 < n.options.autoDisable) && (n.options.disabled = function (e) {
                if (e.is(":hidden")) return !0;
                e = e[0].getBoundingClientRect();
                return !document.elementFromPoint(e.left, e.top) && !document.elementFromPoint(e.left + e.width, e.top + e.height)
            }(n.element), n.options.autoDisable = n.options.disabled ? 2 : 1);
        return l(e, t)
    }), window.jQuery.ajaxTransport("+binary", function (o, e, t) {
        var r;
        if (window.FormData && (o.dataType && "binary" == o.dataType || o.data && (window.ArrayBuffer && o.data instanceof ArrayBuffer || window.Blob && o.data instanceof Blob))) return {
            send: function (e, n) {
                var t, i = o.responseType || "blob",
                    a = o.xhr();
                if (a.open(o.type, o.url, o.async, o.username, o.password), o.xhrFields)
                    for (t in o.xhrFields) a[t] = o.xhrFields[t];
                for (t in o.mimeType && a.overrideMimeType && a.overrideMimeType(o.mimeType), o.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest"), e) a.setRequestHeader(t, e[t]);
                r = function (t) {
                    return function () {
                        var e;
                        r && (r = a.onload = a.onerror = a.onabort = a.ontimeout = null, "abort" === t ? a.abort() : "error" === t ? n(a.status, a.statusText) : ((e = {})[o.dataType] = a.response, n(a.status, a.statusText, e, a.getAllResponseHeaders())))
                    }
                }, a.onload = r(), a.onabort = a.onerror = a.ontimeout = r("error"), r = r("abort");
                try {
                    a.responseType = i, a.send(o.data || null)
                } catch (e) {
                    if (r) throw e
                }
            },
            abort: function () {
                r && r()
            }
        }
    }), (c = jQuery).support.touch = "ontouchend" in document, c.support.touch && (n = c.ui.mouse.prototype, i = n._mouseInit, d = n._mouseDestroy, n._touchStart = function (e) {
        !p && this._mouseCapture(e.originalEvent.changedTouches[0]) && (u = e.originalEvent.changedTouches[0].screenX.toFixed(0), h = e.originalEvent.changedTouches[0].screenY.toFixed(0), p = !0, this._touchMoved = !1, x(e, "mouseover"), x(e, "mousemove"), x(e, "mousedown"))
    }, n._touchMove = function (e) {
        var t, n;
        p && (t = e.originalEvent.changedTouches[0].screenX.toFixed(0), n = e.originalEvent.changedTouches[0].screenY.toFixed(0), Math.abs(u - t) <= 4 && Math.abs(h - n) <= 4 || (this._touchMoved = !0, x(e, "mousemove")))
    }, n._touchEnd = function (e) {
        p && (x(e, "mouseup"), x(e, "mouseout"), this._touchMoved || x(e, "click"), p = !1, this._touchMoved = !1)
    }, n._mouseInit = function () {
        var e = this;
        e.element.hasClass("touch-punch") && e.element.on({
            touchstart: c.proxy(e, "_touchStart"),
            touchmove: c.proxy(e, "_touchMove"),
            touchend: c.proxy(e, "_touchEnd")
        }), i.call(e)
    }, n._mouseDestroy = function () {
        var e = this;
        e.element.hasClass("touch-punch") && e.element.off({
            touchstart: c.proxy(e, "_touchStart"),
            touchmove: c.proxy(e, "_touchMove"),
            touchend: c.proxy(e, "_touchEnd")
        }), d.call(e)
    }), st.fn.elfinder = function (i, a) {
        return "instance" === i ? this.getElFinder() : this.each(function () {
            var e, t = "function" == typeof a ? a : void 0,
                n = this.elfinder;
            if (n) switch ("string" == typeof i ? i : "") {
                case "close":
                case "hide":
                    n.hide();
                    break;
                case "open":
                case "show":
                    n.show();
                    break;
                case "destroy":
                    n.destroy();
                    break;
                case "reload":
                case "restart":
                    n && (e = st.extend(!0, n.options, st.isPlainObject(a) ? a : {}), t = n.bootCallback, n.reloadCallback && "function" == typeof n.reloadCallback ? n.reloadCallback(e, t) : (n.destroy(), new Fe(this, e, t)))
            } else st.isPlainObject(i) && new Fe(this, i, t)
        })
    }, st.fn.getElFinder = function () {
        var e;
        return this.each(function () {
            if (this.elfinder) return e = this.elfinder, !1
        }), e
    }, st.fn.elfUiWidgetInstance = function (t) {
        try {
            return this[t]("instance")
        } catch (e) {
            var n = this.data("ui-" + t);
            return n && "object" == typeof n && n.widgetFullName === "ui-" + t ? n : null
        }
    }, st.fn.scrollRight || st.fn.extend({
        scrollRight: function (e) {
            var t = this.get(0);
            return void 0 === e ? Math.max(0, t.scrollWidth - (t.scrollLeft + t.clientWidth)) : this.scrollLeft(t.scrollWidth - t.clientWidth - e)
        }
    }), st.fn.scrollBottom || st.fn.extend({
        scrollBottom: function (e) {
            var t = this.get(0);
            return void 0 === e ? Math.max(0, t.scrollHeight - (t.scrollTop + t.clientHeight)) : this.scrollTop(t.scrollHeight - t.clientHeight - e)
        }
    }), Fe.prototype.mimeTypes = {
        "application/x-executable": "exe",
        "application/x-jar": "jar",
        "application/x-gzip": "gz",
        "application/x-bzip2": "tbz",
        "application/x-rar": "rar",
        "text/x-php": "php",
        "text/javascript": "js",
        "application/rtfd": "rtfd",
        "text/x-python": "py",
        "text/x-ruby": "rb",
        "text/x-shellscript": "sh",
        "text/x-perl": "pl",
        "text/xml": "xml",
        "text/x-csrc": "c",
        "text/x-chdr": "h",
        "text/x-c++src": "cpp",
        "text/x-c++hdr": "hh",
        "text/x-markdown": "md",
        "text/x-yaml": "yml",
        "image/x-ms-bmp": "bmp",
        "image/x-targa": "tga",
        "image/xbm": "xbm",
        "image/pxm": "pxm",
        "audio/wav": "wav",
        "video/x-dv": "dv",
        "video/x-ms-wmv": "wm",
        "video/ogg": "ogm",
        "video/MP2T": "m2ts",
        "application/x-mpegURL": "m3u8",
        "application/dash+xml": "mpd",
        "application/andrew-inset": "ez",
        "application/applixware": "aw",
        "application/atom+xml": "atom",
        "application/atomcat+xml": "atomcat",
        "application/atomsvc+xml": "atomsvc",
        "application/ccxml+xml": "ccxml",
        "application/cdmi-capability": "cdmia",
        "application/cdmi-container": "cdmic",
        "application/cdmi-domain": "cdmid",
        "application/cdmi-object": "cdmio",
        "application/cdmi-queue": "cdmiq",
        "application/cu-seeme": "cu",
        "application/davmount+xml": "davmount",
        "application/docbook+xml": "dbk",
        "application/dssc+der": "dssc",
        "application/dssc+xml": "xdssc",
        "application/ecmascript": "ecma",
        "application/emma+xml": "emma",
        "application/epub+zip": "epub",
        "application/exi": "exi",
        "application/font-tdpfr": "pfr",
        "application/gml+xml": "gml",
        "application/gpx+xml": "gpx",
        "application/gxf": "gxf",
        "application/hyperstudio": "stk",
        "application/inkml+xml": "ink",
        "application/ipfix": "ipfix",
        "application/java-serialized-object": "ser",
        "application/java-vm": "class",
        "application/json": "json",
        "application/jsonml+json": "jsonml",
        "application/lost+xml": "lostxml",
        "application/mac-binhex40": "hqx",
        "application/mac-compactpro": "cpt",
        "application/mads+xml": "mads",
        "application/marc": "mrc",
        "application/marcxml+xml": "mrcx",
        "application/mathematica": "ma",
        "application/mathml+xml": "mathml",
        "application/mbox": "mbox",
        "application/mediaservercontrol+xml": "mscml",
        "application/metalink+xml": "metalink",
        "application/metalink4+xml": "meta4",
        "application/mets+xml": "mets",
        "application/mods+xml": "mods",
        "application/mp21": "m21",
        "application/mp4": "mp4s",
        "application/msword": "doc",
        "application/mxf": "mxf",
        "application/octet-stream": "bin",
        "application/oda": "oda",
        "application/oebps-package+xml": "opf",
        "application/ogg": "ogx",
        "application/omdoc+xml": "omdoc",
        "application/onenote": "onetoc",
        "application/oxps": "oxps",
        "application/patch-ops-error+xml": "xer",
        "application/pdf": "pdf",
        "application/pgp-encrypted": "pgp",
        "application/pgp-signature": "asc",
        "application/pics-rules": "prf",
        "application/pkcs10": "p10",
        "application/pkcs7-mime": "p7m",
        "application/pkcs7-signature": "p7s",
        "application/pkcs8": "p8",
        "application/pkix-attr-cert": "ac",
        "application/pkix-cert": "cer",
        "application/pkix-crl": "crl",
        "application/pkix-pkipath": "pkipath",
        "application/pkixcmp": "pki",
        "application/pls+xml": "pls",
        "application/postscript": "ai",
        "application/prs.cww": "cww",
        "application/pskc+xml": "pskcxml",
        "application/rdf+xml": "rdf",
        "application/reginfo+xml": "rif",
        "application/relax-ng-compact-syntax": "rnc",
        "application/resource-lists+xml": "rl",
        "application/resource-lists-diff+xml": "rld",
        "application/rls-services+xml": "rs",
        "application/rpki-ghostbusters": "gbr",
        "application/rpki-manifest": "mft",
        "application/rpki-roa": "roa",
        "application/rsd+xml": "rsd",
        "application/rss+xml": "rss",
        "application/rtf": "rtf",
        "application/sbml+xml": "sbml",
        "application/scvp-cv-request": "scq",
        "application/scvp-cv-response": "scs",
        "application/scvp-vp-request": "spq",
        "application/scvp-vp-response": "spp",
        "application/sdp": "sdp",
        "application/set-payment-initiation": "setpay",
        "application/set-registration-initiation": "setreg",
        "application/shf+xml": "shf",
        "application/smil+xml": "smi",
        "application/sparql-query": "rq",
        "application/sparql-results+xml": "srx",
        "application/srgs": "gram",
        "application/srgs+xml": "grxml",
        "application/sru+xml": "sru",
        "application/ssdl+xml": "ssdl",
        "application/ssml+xml": "ssml",
        "application/tei+xml": "tei",
        "application/thraud+xml": "tfi",
        "application/timestamped-data": "tsd",
        "application/vnd.3gpp.pic-bw-large": "plb",
        "application/vnd.3gpp.pic-bw-small": "psb",
        "application/vnd.3gpp.pic-bw-var": "pvb",
        "application/vnd.3gpp2.tcap": "tcap",
        "application/vnd.3m.post-it-notes": "pwn",
        "application/vnd.accpac.simply.aso": "aso",
        "application/vnd.accpac.simply.imp": "imp",
        "application/vnd.acucobol": "acu",
        "application/vnd.acucorp": "atc",
        "application/vnd.adobe.air-application-installer-package+zip": "air",
        "application/vnd.adobe.formscentral.fcdt": "fcdt",
        "application/vnd.adobe.fxp": "fxp",
        "application/vnd.adobe.xdp+xml": "xdp",
        "application/vnd.adobe.xfdf": "xfdf",
        "application/vnd.ahead.space": "ahead",
        "application/vnd.airzip.filesecure.azf": "azf",
        "application/vnd.airzip.filesecure.azs": "azs",
        "application/vnd.amazon.ebook": "azw",
        "application/vnd.americandynamics.acc": "acc",
        "application/vnd.amiga.ami": "ami",
        "application/vnd.android.package-archive": "apk",
        "application/vnd.anser-web-certificate-issue-initiation": "cii",
        "application/vnd.anser-web-funds-transfer-initiation": "fti",
        "application/vnd.antix.game-component": "atx",
        "application/vnd.apple.installer+xml": "mpkg",
        "application/vnd.aristanetworks.swi": "swi",
        "application/vnd.astraea-software.iota": "iota",
        "application/vnd.audiograph": "aep",
        "application/vnd.blueice.multipass": "mpm",
        "application/vnd.bmi": "bmi",
        "application/vnd.businessobjects": "rep",
        "application/vnd.chemdraw+xml": "cdxml",
        "application/vnd.chipnuts.karaoke-mmd": "mmd",
        "application/vnd.cinderella": "cdy",
        "application/vnd.claymore": "cla",
        "application/vnd.cloanto.rp9": "rp9",
        "application/vnd.clonk.c4group": "c4g",
        "application/vnd.cluetrust.cartomobile-config": "c11amc",
        "application/vnd.cluetrust.cartomobile-config-pkg": "c11amz",
        "application/vnd.commonspace": "csp",
        "application/vnd.contact.cmsg": "cdbcmsg",
        "application/vnd.cosmocaller": "cmc",
        "application/vnd.crick.clicker": "clkx",
        "application/vnd.crick.clicker.keyboard": "clkk",
        "application/vnd.crick.clicker.palette": "clkp",
        "application/vnd.crick.clicker.template": "clkt",
        "application/vnd.crick.clicker.wordbank": "clkw",
        "application/vnd.criticaltools.wbs+xml": "wbs",
        "application/vnd.ctc-posml": "pml",
        "application/vnd.cups-ppd": "ppd",
        "application/vnd.curl.car": "car",
        "application/vnd.curl.pcurl": "pcurl",
        "application/vnd.dart": "dart",
        "application/vnd.data-vision.rdz": "rdz",
        "application/vnd.dece.data": "uvf",
        "application/vnd.dece.ttml+xml": "uvt",
        "application/vnd.dece.unspecified": "uvx",
        "application/vnd.dece.zip": "uvz",
        "application/vnd.denovo.fcselayout-link": "fe_launch",
        "application/vnd.dna": "dna",
        "application/vnd.dolby.mlp": "mlp",
        "application/vnd.dpgraph": "dpg",
        "application/vnd.dreamfactory": "dfac",
        "application/vnd.ds-keypoint": "kpxx",
        "application/vnd.dvb.ait": "ait",
        "application/vnd.dvb.service": "svc",
        "application/vnd.dynageo": "geo",
        "application/vnd.ecowin.chart": "mag",
        "application/vnd.enliven": "nml",
        "application/vnd.epson.esf": "esf",
        "application/vnd.epson.msf": "msf",
        "application/vnd.epson.quickanime": "qam",
        "application/vnd.epson.salt": "slt",
        "application/vnd.epson.ssf": "ssf",
        "application/vnd.eszigno3+xml": "es3",
        "application/vnd.ezpix-album": "ez2",
        "application/vnd.ezpix-package": "ez3",
        "application/vnd.fdf": "fdf",
        "application/vnd.fdsn.mseed": "mseed",
        "application/vnd.fdsn.seed": "seed",
        "application/vnd.flographit": "gph",
        "application/vnd.fluxtime.clip": "ftc",
        "application/vnd.framemaker": "fm",
        "application/vnd.frogans.fnc": "fnc",
        "application/vnd.frogans.ltf": "ltf",
        "application/vnd.fsc.weblaunch": "fsc",
        "application/vnd.fujitsu.oasys": "oas",
        "application/vnd.fujitsu.oasys2": "oa2",
        "application/vnd.fujitsu.oasys3": "oa3",
        "application/vnd.fujitsu.oasysgp": "fg5",
        "application/vnd.fujitsu.oasysprs": "bh2",
        "application/vnd.fujixerox.ddd": "ddd",
        "application/vnd.fujixerox.docuworks": "xdw",
        "application/vnd.fujixerox.docuworks.binder": "xbd",
        "application/vnd.fuzzysheet": "fzs",
        "application/vnd.genomatix.tuxedo": "txd",
        "application/vnd.geogebra.file": "ggb",
        "application/vnd.geogebra.tool": "ggt",
        "application/vnd.geometry-explorer": "gex",
        "application/vnd.geonext": "gxt",
        "application/vnd.geoplan": "g2w",
        "application/vnd.geospace": "g3w",
        "application/vnd.gmx": "gmx",
        "application/vnd.google-earth.kml+xml": "kml",
        "application/vnd.google-earth.kmz": "kmz",
        "application/vnd.grafeq": "gqf",
        "application/vnd.groove-account": "gac",
        "application/vnd.groove-help": "ghf",
        "application/vnd.groove-identity-message": "gim",
        "application/vnd.groove-injector": "grv",
        "application/vnd.groove-tool-message": "gtm",
        "application/vnd.groove-tool-template": "tpl",
        "application/vnd.groove-vcard": "vcg",
        "application/vnd.hal+xml": "hal",
        "application/vnd.handheld-entertainment+xml": "zmm",
        "application/vnd.hbci": "hbci",
        "application/vnd.hhe.lesson-player": "les",
        "application/vnd.hp-hpgl": "hpgl",
        "application/vnd.hp-hpid": "hpid",
        "application/vnd.hp-hps": "hps",
        "application/vnd.hp-jlyt": "jlt",
        "application/vnd.hp-pcl": "pcl",
        "application/vnd.hp-pclxl": "pclxl",
        "application/vnd.hydrostatix.sof-data": "sfd-hdstx",
        "application/vnd.ibm.minipay": "mpy",
        "application/vnd.ibm.modcap": "afp",
        "application/vnd.ibm.rights-management": "irm",
        "application/vnd.ibm.secure-container": "sc",
        "application/vnd.iccprofile": "icc",
        "application/vnd.igloader": "igl",
        "application/vnd.immervision-ivp": "ivp",
        "application/vnd.immervision-ivu": "ivu",
        "application/vnd.insors.igm": "igm",
        "application/vnd.intercon.formnet": "xpw",
        "application/vnd.intergeo": "i2g",
        "application/vnd.intu.qbo": "qbo",
        "application/vnd.intu.qfx": "qfx",
        "application/vnd.ipunplugged.rcprofile": "rcprofile",
        "application/vnd.irepository.package+xml": "irp",
        "application/vnd.is-xpr": "xpr",
        "application/vnd.isac.fcs": "fcs",
        "application/vnd.jam": "jam",
        "application/vnd.jcp.javame.midlet-rms": "rms",
        "application/vnd.jisp": "jisp",
        "application/vnd.joost.joda-archive": "joda",
        "application/vnd.kahootz": "ktz",
        "application/vnd.kde.karbon": "karbon",
        "application/vnd.kde.kchart": "chrt",
        "application/vnd.kde.kformula": "kfo",
        "application/vnd.kde.kivio": "flw",
        "application/vnd.kde.kontour": "kon",
        "application/vnd.kde.kpresenter": "kpr",
        "application/vnd.kde.kspread": "ksp",
        "application/vnd.kde.kword": "kwd",
        "application/vnd.kenameaapp": "htke",
        "application/vnd.kidspiration": "kia",
        "application/vnd.kinar": "kne",
        "application/vnd.koan": "skp",
        "application/vnd.kodak-descriptor": "sse",
        "application/vnd.las.las+xml": "lasxml",
        "application/vnd.llamagraphics.life-balance.desktop": "lbd",
        "application/vnd.llamagraphics.life-balance.exchange+xml": "lbe",
        "application/vnd.lotus-1-2-3": 123,
        "application/vnd.lotus-approach": "apr",
        "application/vnd.lotus-freelance": "pre",
        "application/vnd.lotus-notes": "nsf",
        "application/vnd.lotus-organizer": "org",
        "application/vnd.lotus-screencam": "scm",
        "application/vnd.lotus-wordpro": "lwp",
        "application/vnd.macports.portpkg": "portpkg",
        "application/vnd.mcd": "mcd",
        "application/vnd.medcalcdata": "mc1",
        "application/vnd.mediastation.cdkey": "cdkey",
        "application/vnd.mfer": "mwf",
        "application/vnd.mfmp": "mfm",
        "application/vnd.micrografx.flo": "flo",
        "application/vnd.micrografx.igx": "igx",
        "application/vnd.mif": "mif",
        "application/vnd.mobius.daf": "daf",
        "application/vnd.mobius.dis": "dis",
        "application/vnd.mobius.mbk": "mbk",
        "application/vnd.mobius.mqy": "mqy",
        "application/vnd.mobius.msl": "msl",
        "application/vnd.mobius.plc": "plc",
        "application/vnd.mobius.txf": "txf",
        "application/vnd.mophun.application": "mpn",
        "application/vnd.mophun.certificate": "mpc",
        "application/vnd.mozilla.xul+xml": "xul",
        "application/vnd.ms-artgalry": "cil",
        "application/vnd.ms-cab-compressed": "cab",
        "application/vnd.ms-excel": "xls",
        "application/vnd.ms-excel.addin.macroenabled.12": "xlam",
        "application/vnd.ms-excel.sheet.binary.macroenabled.12": "xlsb",
        "application/vnd.ms-excel.sheet.macroenabled.12": "xlsm",
        "application/vnd.ms-excel.template.macroenabled.12": "xltm",
        "application/vnd.ms-fontobject": "eot",
        "application/vnd.ms-htmlhelp": "chm",
        "application/vnd.ms-ims": "ims",
        "application/vnd.ms-lrm": "lrm",
        "application/vnd.ms-officetheme": "thmx",
        "application/vnd.ms-outlook": "msg",
        "application/vnd.ms-pki.seccat": "cat",
        "application/vnd.ms-pki.stl": "stl",
        "application/vnd.ms-powerpoint": "ppt",
        "application/vnd.ms-powerpoint.addin.macroenabled.12": "ppam",
        "application/vnd.ms-powerpoint.presentation.macroenabled.12": "pptm",
        "application/vnd.ms-powerpoint.slide.macroenabled.12": "sldm",
        "application/vnd.ms-powerpoint.slideshow.macroenabled.12": "ppsm",
        "application/vnd.ms-powerpoint.template.macroenabled.12": "potm",
        "application/vnd.ms-project": "mpp",
        "application/vnd.ms-word.document.macroenabled.12": "docm",
        "application/vnd.ms-word.template.macroenabled.12": "dotm",
        "application/vnd.ms-works": "wps",
        "application/vnd.ms-wpl": "wpl",
        "application/vnd.ms-xpsdocument": "xps",
        "application/vnd.mseq": "mseq",
        "application/vnd.musician": "mus",
        "application/vnd.muvee.style": "msty",
        "application/vnd.mynfc": "taglet",
        "application/vnd.neurolanguage.nlu": "nlu",
        "application/vnd.nitf": "ntf",
        "application/vnd.noblenet-directory": "nnd",
        "application/vnd.noblenet-sealer": "nns",
        "application/vnd.noblenet-web": "nnw",
        "application/vnd.nokia.n-gage.data": "ngdat",
        "application/vnd.nokia.n-gage.symbian.install": "n-gage",
        "application/vnd.nokia.radio-preset": "rpst",
        "application/vnd.nokia.radio-presets": "rpss",
        "application/vnd.novadigm.edm": "edm",
        "application/vnd.novadigm.edx": "edx",
        "application/vnd.novadigm.ext": "ext",
        "application/vnd.oasis.opendocument.chart": "odc",
        "application/vnd.oasis.opendocument.chart-template": "otc",
        "application/vnd.oasis.opendocument.database": "odb",
        "application/vnd.oasis.opendocument.formula": "odf",
        "application/vnd.oasis.opendocument.formula-template": "odft",
        "application/vnd.oasis.opendocument.graphics": "odg",
        "application/vnd.oasis.opendocument.graphics-template": "otg",
        "application/vnd.oasis.opendocument.image": "odi",
        "application/vnd.oasis.opendocument.image-template": "oti",
        "application/vnd.oasis.opendocument.presentation": "odp",
        "application/vnd.oasis.opendocument.presentation-template": "otp",
        "application/vnd.oasis.opendocument.spreadsheet": "ods",
        "application/vnd.oasis.opendocument.spreadsheet-template": "ots",
        "application/vnd.oasis.opendocument.text": "odt",
        "application/vnd.oasis.opendocument.text-master": "odm",
        "application/vnd.oasis.opendocument.text-template": "ott",
        "application/vnd.oasis.opendocument.text-web": "oth",
        "application/vnd.olpc-sugar": "xo",
        "application/vnd.oma.dd2+xml": "dd2",
        "application/vnd.openofficeorg.extension": "oxt",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
        "application/vnd.openxmlformats-officedocument.presentationml.slide": "sldx",
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow": "ppsx",
        "application/vnd.openxmlformats-officedocument.presentationml.template": "potx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.template": "xltx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.template": "dotx",
        "application/vnd.osgeo.mapguide.package": "mgp",
        "application/vnd.osgi.dp": "dp",
        "application/vnd.osgi.subsystem": "esa",
        "application/vnd.palm": "pdb",
        "application/vnd.pawaafile": "paw",
        "application/vnd.pg.format": "str",
        "application/vnd.pg.osasli": "ei6",
        "application/vnd.picsel": "efif",
        "application/vnd.pmi.widget": "wg",
        "application/vnd.pocketlearn": "plf",
        "application/vnd.powerbuilder6": "pbd",
        "application/vnd.previewsystems.box": "box",
        "application/vnd.proteus.magazine": "mgz",
        "application/vnd.publishare-delta-tree": "qps",
        "application/vnd.pvi.ptid1": "ptid",
        "application/vnd.quark.quarkxpress": "qxd",
        "application/vnd.realvnc.bed": "bed",
        "application/vnd.recordare.musicxml": "mxl",
        "application/vnd.recordare.musicxml+xml": "musicxml",
        "application/vnd.rig.cryptonote": "cryptonote",
        "application/vnd.rim.cod": "cod",
        "application/vnd.rn-realmedia": "rm",
        "application/vnd.rn-realmedia-vbr": "rmvb",
        "application/vnd.route66.link66+xml": "link66",
        "application/vnd.sailingtracker.track": "st",
        "application/vnd.seemail": "see",
        "application/vnd.sema": "sema",
        "application/vnd.semd": "semd",
        "application/vnd.semf": "semf",
        "application/vnd.shana.informed.formdata": "ifm",
        "application/vnd.shana.informed.formtemplate": "itp",
        "application/vnd.shana.informed.interchange": "iif",
        "application/vnd.shana.informed.package": "ipk",
        "application/vnd.simtech-mindmapper": "twd",
        "application/vnd.smaf": "mmf",
        "application/vnd.smart.teacher": "teacher",
        "application/vnd.solent.sdkm+xml": "sdkm",
        "application/vnd.spotfire.dxp": "dxp",
        "application/vnd.spotfire.sfs": "sfs",
        "application/vnd.stardivision.calc": "sdc",
        "application/vnd.stardivision.draw": "sda",
        "application/vnd.stardivision.impress": "sdd",
        "application/vnd.stardivision.math": "smf",
        "application/vnd.stardivision.writer": "sdw",
        "application/vnd.stardivision.writer-global": "sgl",
        "application/vnd.stepmania.package": "smzip",
        "application/vnd.stepmania.stepchart": "sm",
        "application/vnd.sun.xml.calc": "sxc",
        "application/vnd.sun.xml.calc.template": "stc",
        "application/vnd.sun.xml.draw": "sxd",
        "application/vnd.sun.xml.draw.template": "std",
        "application/vnd.sun.xml.impress": "sxi",
        "application/vnd.sun.xml.impress.template": "sti",
        "application/vnd.sun.xml.math": "sxm",
        "application/vnd.sun.xml.writer": "sxw",
        "application/vnd.sun.xml.writer.global": "sxg",
        "application/vnd.sun.xml.writer.template": "stw",
        "application/vnd.sus-calendar": "sus",
        "application/vnd.svd": "svd",
        "application/vnd.symbian.install": "sis",
        "application/vnd.syncml+xml": "xsm",
        "application/vnd.syncml.dm+wbxml": "bdm",
        "application/vnd.syncml.dm+xml": "xdm",
        "application/vnd.tao.intent-module-archive": "tao",
        "application/vnd.tcpdump.pcap": "pcap",
        "application/vnd.tmobile-livetv": "tmo",
        "application/vnd.trid.tpt": "tpt",
        "application/vnd.triscape.mxs": "mxs",
        "application/vnd.trueapp": "tra",
        "application/vnd.ufdl": "ufd",
        "application/vnd.uiq.theme": "utz",
        "application/vnd.umajin": "umj",
        "application/vnd.unity": "unityweb",
        "application/vnd.uoml+xml": "uoml",
        "application/vnd.vcx": "vcx",
        "application/vnd.visio": "vsd",
        "application/vnd.visionary": "vis",
        "application/vnd.vsf": "vsf",
        "application/vnd.wap.wbxml": "wbxml",
        "application/vnd.wap.wmlc": "wmlc",
        "application/vnd.wap.wmlscriptc": "wmlsc",
        "application/vnd.webturbo": "wtb",
        "application/vnd.wolfram.player": "nbp",
        "application/vnd.wordperfect": "wpd",
        "application/vnd.wqd": "wqd",
        "application/vnd.wt.stf": "stf",
        "application/vnd.xara": "xar",
        "application/vnd.xfdl": "xfdl",
        "application/vnd.yamaha.hv-dic": "hvd",
        "application/vnd.yamaha.hv-script": "hvs",
        "application/vnd.yamaha.hv-voice": "hvp",
        "application/vnd.yamaha.openscoreformat": "osf",
        "application/vnd.yamaha.openscoreformat.osfpvg+xml": "osfpvg",
        "application/vnd.yamaha.smaf-audio": "saf",
        "application/vnd.yamaha.smaf-phrase": "spf",
        "application/vnd.yellowriver-custom-menu": "cmp",
        "application/vnd.zul": "zir",
        "application/vnd.zzazz.deck+xml": "zaz",
        "application/voicexml+xml": "vxml",
        "application/widget": "wgt",
        "application/winhlp": "hlp",
        "application/wsdl+xml": "wsdl",
        "application/wspolicy+xml": "wspolicy",
        "application/x-7z-compressed": "7z",
        "application/x-abiword": "abw",
        "application/x-ace-compressed": "ace",
        "application/x-apple-diskimage": "dmg",
        "application/x-authorware-bin": "aab",
        "application/x-authorware-map": "aam",
        "application/x-authorware-seg": "aas",
        "application/x-bcpio": "bcpio",
        "application/x-bittorrent": "torrent",
        "application/x-blorb": "blb",
        "application/x-bzip": "bz",
        "application/x-cbr": "cbr",
        "application/x-cdlink": "vcd",
        "application/x-cfs-compressed": "cfs",
        "application/x-chat": "chat",
        "application/x-chess-pgn": "pgn",
        "application/x-conference": "nsc",
        "application/x-cpio": "cpio",
        "application/x-csh": "csh",
        "application/x-debian-package": "deb",
        "application/x-dgc-compressed": "dgc",
        "application/x-director": "dir",
        "application/x-doom": "wad",
        "application/x-dtbncx+xml": "ncx",
        "application/x-dtbook+xml": "dtb",
        "application/x-dtbresource+xml": "res",
        "application/x-dvi": "dvi",
        "application/x-envoy": "evy",
        "application/x-eva": "eva",
        "application/x-font-bdf": "bdf",
        "application/x-font-ghostscript": "gsf",
        "application/x-font-linux-psf": "psf",
        "application/x-font-pcf": "pcf",
        "application/x-font-snf": "snf",
        "application/x-font-type1": "pfa",
        "application/x-freearc": "arc",
        "application/x-futuresplash": "spl",
        "application/x-gca-compressed": "gca",
        "application/x-glulx": "ulx",
        "application/x-gnumeric": "gnumeric",
        "application/x-gramps-xml": "gramps",
        "application/x-gtar": "gtar",
        "application/x-hdf": "hdf",
        "application/x-install-instructions": "install",
        "application/x-iso9660-image": "iso",
        "application/x-java-jnlp-file": "jnlp",
        "application/x-latex": "latex",
        "application/x-lzh-compressed": "lzh",
        "application/x-mie": "mie",
        "application/x-mobipocket-ebook": "prc",
        "application/x-ms-application": "application",
        "application/x-ms-shortcut": "lnk",
        "application/x-ms-wmd": "wmd",
        "application/x-ms-wmz": "wmz",
        "application/x-ms-xbap": "xbap",
        "application/x-msaccess": "mdb",
        "application/x-msbinder": "obd",
        "application/x-mscardfile": "crd",
        "application/x-msclip": "clp",
        "application/x-msdownload": "dll",
        "application/x-msmediaview": "mvb",
        "application/x-msmetafile": "wmf",
        "application/x-msmoney": "mny",
        "application/x-mspublisher": "pub",
        "application/x-msschedule": "scd",
        "application/x-msterminal": "trm",
        "application/x-mswrite": "wri",
        "application/x-netcdf": "nc",
        "application/x-nzb": "nzb",
        "application/x-pkcs12": "p12",
        "application/x-pkcs7-certificates": "p7b",
        "application/x-pkcs7-certreqresp": "p7r",
        "application/x-research-info-systems": "ris",
        "application/x-shar": "shar",
        "application/x-shockwave-flash": "swf",
        "application/x-silverlight-app": "xap",
        "application/x-sql": "sql",
        "application/x-stuffit": "sit",
        "application/x-stuffitx": "sitx",
        "application/x-subrip": "srt",
        "application/x-sv4cpio": "sv4cpio",
        "application/x-sv4crc": "sv4crc",
        "application/x-t3vm-image": "t3",
        "application/x-tads": "gam",
        "application/x-tar": "tar",
        "application/x-tcl": "tcl",
        "application/x-tex": "tex",
        "application/x-tex-tfm": "tfm",
        "application/x-texinfo": "texinfo",
        "application/x-tgif": "obj",
        "application/x-ustar": "ustar",
        "application/x-wais-source": "src",
        "application/x-x509-ca-cert": "der",
        "application/x-xfig": "fig",
        "application/x-xliff+xml": "xlf",
        "application/x-xpinstall": "xpi",
        "application/x-xz": "xz",
        "application/x-zmachine": "z1",
        "application/xaml+xml": "xaml",
        "application/xcap-diff+xml": "xdf",
        "application/xenc+xml": "xenc",
        "application/xhtml+xml": "xhtml",
        "application/xml": "xsl",
        "application/xml-dtd": "dtd",
        "application/xop+xml": "xop",
        "application/xproc+xml": "xpl",
        "application/xslt+xml": "xslt",
        "application/xspf+xml": "xspf",
        "application/xv+xml": "mxml",
        "application/yang": "yang",
        "application/yin+xml": "yin",
        "application/zip": "zip",
        "audio/adpcm": "adp",
        "audio/basic": "au",
        "audio/midi": "mid",
        "audio/mp4": "m4a",
        "audio/mpeg": "mpga",
        "audio/ogg": "oga",
        "audio/s3m": "s3m",
        "audio/silk": "sil",
        "audio/vnd.dece.audio": "uva",
        "audio/vnd.digital-winds": "eol",
        "audio/vnd.dra": "dra",
        "audio/vnd.dts": "dts",
        "audio/vnd.dts.hd": "dtshd",
        "audio/vnd.lucent.voice": "lvp",
        "audio/vnd.ms-playready.media.pya": "pya",
        "audio/vnd.nuera.ecelp4800": "ecelp4800",
        "audio/vnd.nuera.ecelp7470": "ecelp7470",
        "audio/vnd.nuera.ecelp9600": "ecelp9600",
        "audio/vnd.rip": "rip",
        "audio/webm": "weba",
        "audio/x-aac": "aac",
        "audio/x-aiff": "aif",
        "audio/x-caf": "caf",
        "audio/x-flac": "flac",
        "audio/x-matroska": "mka",
        "audio/x-mpegurl": "m3u",
        "audio/x-ms-wax": "wax",
        "audio/x-ms-wma": "wma",
        "audio/x-pn-realaudio": "ram",
        "audio/x-pn-realaudio-plugin": "rmp",
        "audio/xm": "xm",
        "chemical/x-cdx": "cdx",
        "chemical/x-cif": "cif",
        "chemical/x-cmdf": "cmdf",
        "chemical/x-cml": "cml",
        "chemical/x-csml": "csml",
        "chemical/x-xyz": "xyz",
        "font/collection": "ttc",
        "font/otf": "otf",
        "font/ttf": "ttf",
        "font/woff": "woff",
        "font/woff2": "woff2",
        "image/cgm": "cgm",
        "image/g3fax": "g3",
        "image/gif": "gif",
        "image/ief": "ief",
        "image/jpeg": "jpeg",
        "image/ktx": "ktx",
        "image/png": "png",
        "image/prs.btif": "btif",
        "image/sgi": "sgi",
        "image/svg+xml": "svg",
        "image/tiff": "tiff",
        "image/vnd.adobe.photoshop": "psd",
        "image/vnd.dece.graphic": "uvi",
        "image/vnd.djvu": "djvu",
        "image/vnd.dvb.subtitle": "sub",
        "image/vnd.dwg": "dwg",
        "image/vnd.dxf": "dxf",
        "image/vnd.fastbidsheet": "fbs",
        "image/vnd.fpx": "fpx",
        "image/vnd.fst": "fst",
        "image/vnd.fujixerox.edmics-mmr": "mmr",
        "image/vnd.fujixerox.edmics-rlc": "rlc",
        "image/vnd.ms-modi": "mdi",
        "image/vnd.ms-photo": "wdp",
        "image/vnd.net-fpx": "npx",
        "image/vnd.wap.wbmp": "wbmp",
        "image/vnd.xiff": "xif",
        "image/webp": "webp",
        "image/x-3ds": "3ds",
        "image/x-cmu-raster": "ras",
        "image/x-cmx": "cmx",
        "image/x-freehand": "fh",
        "image/x-icon": "ico",
        "image/x-mrsid-image": "sid",
        "image/x-pcx": "pcx",
        "image/x-pict": "pic",
        "image/x-portable-anymap": "pnm",
        "image/x-portable-bitmap": "pbm",
        "image/x-portable-graymap": "pgm",
        "image/x-portable-pixmap": "ppm",
        "image/x-rgb": "rgb",
        "image/x-xpixmap": "xpm",
        "image/x-xwindowdump": "xwd",
        "message/rfc822": "eml",
        "model/iges": "igs",
        "model/mesh": "msh",
        "model/vnd.collada+xml": "dae",
        "model/vnd.dwf": "dwf",
        "model/vnd.gdl": "gdl",
        "model/vnd.gtw": "gtw",
        "model/vnd.vtu": "vtu",
        "model/vrml": "wrl",
        "model/x3d+binary": "x3db",
        "model/x3d+vrml": "x3dv",
        "model/x3d+xml": "x3d",
        "text/cache-manifest": "appcache",
        "text/calendar": "ics",
        "text/css": "css",
        "text/csv": "csv",
        "text/html": "html",
        "text/n3": "n3",
        "text/plain": "txt",
        "text/prs.lines.tag": "dsc",
        "text/richtext": "rtx",
        "text/sgml": "sgml",
        "text/tab-separated-values": "tsv",
        "text/troff": "t",
        "text/turtle": "ttl",
        "text/uri-list": "uri",
        "text/vcard": "vcard",
        "text/vnd.curl": "curl",
        "text/vnd.curl.dcurl": "dcurl",
        "text/vnd.curl.mcurl": "mcurl",
        "text/vnd.curl.scurl": "scurl",
        "text/vnd.fly": "fly",
        "text/vnd.fmi.flexstor": "flx",
        "text/vnd.graphviz": "gv",
        "text/vnd.in3d.3dml": "3dml",
        "text/vnd.in3d.spot": "spot",
        "text/vnd.sun.j2me.app-descriptor": "jad",
        "text/vnd.wap.wml": "wml",
        "text/vnd.wap.wmlscript": "wmls",
        "text/x-asm": "s",
        "text/x-c": "cc",
        "text/x-fortran": "f",
        "text/x-java-source": "java",
        "text/x-nfo": "nfo",
        "text/x-opml": "opml",
        "text/x-pascal": "p",
        "text/x-setext": "etx",
        "text/x-sfv": "sfv",
        "text/x-uuencode": "uu",
        "text/x-vcalendar": "vcs",
        "text/x-vcard": "vcf",
        "video/3gpp": "3gp",
        "video/3gpp2": "3g2",
        "video/h261": "h261",
        "video/h263": "h263",
        "video/h264": "h264",
        "video/jpeg": "jpgv",
        "video/jpm": "jpm",
        "video/mj2": "mj2",
        "video/mp4": "mp4",
        "video/mpeg": "mpeg",
        "video/quicktime": "qt",
        "video/vnd.dece.hd": "uvh",
        "video/vnd.dece.mobile": "uvm",
        "video/vnd.dece.pd": "uvp",
        "video/vnd.dece.sd": "uvs",
        "video/vnd.dece.video": "uvv",
        "video/vnd.dvb.file": "dvb",
        "video/vnd.fvt": "fvt",
        "video/vnd.mpegurl": "mxu",
        "video/vnd.ms-playready.media.pyv": "pyv",
        "video/vnd.uvvu.mp4": "uvu",
        "video/vnd.vivo": "viv",
        "video/webm": "webm",
        "video/x-f4v": "f4v",
        "video/x-fli": "fli",
        "video/x-flv": "flv",
        "video/x-m4v": "m4v",
        "video/x-matroska": "mkv",
        "video/x-mng": "mng",
        "video/x-ms-asf": "asf",
        "video/x-ms-vob": "vob",
        "video/x-ms-wmx": "wmx",
        "video/x-ms-wvx": "wvx",
        "video/x-msvideo": "avi",
        "video/x-sgi-movie": "movie",
        "video/x-smv": "smv",
        "x-conference/x-cooltalk": "ice",
        "text/x-sql": "sql",
        "image/x-pixlr-data": "pxd",
        "image/x-adobe-dng": "dng",
        "image/x-sketch": "sketch",
        "image/x-xcf": "xcf",
        "audio/amr": "amr",
        "image/vnd-ms.dds": "dds",
        "application/plt": "plt",
        "application/sat": "sat",
        "application/step": "step",
        "text/x-httpd-cgi": "cgi",
        "text/x-asap": "asp",
        "text/x-jsp": "jsp"
    }, (Fe.prototype._options = {
        cdns: {
            ace: "https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.2",
            codemirror: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7",
            ckeditor: "https://cdnjs.cloudflare.com/ajax/libs/ckeditor/4.22.1",
            ckeditor5: "https://cdn.ckeditor.com/ckeditor5/40.2.0",
            tinymce: "https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2",
            simplemde: "https://cdnjs.cloudflare.com/ajax/libs/simplemde/1.11.2",
            fabric: "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1",
            fabric16: "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.6.7",
            tui: "https://uicdn.toast.com",
            hls: "https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.14/hls.min.js",
            dash: "https://cdnjs.cloudflare.com/ajax/libs/dashjs/4.7.3/dash.all.min.js",
            flv: "https://cdnjs.cloudflare.com/ajax/libs/flv.js/1.6.2/flv.min.js",
            videojs: "https://cdnjs.cloudflare.com/ajax/libs/video.js/8.8.0",
            prettify: "https://cdn.jsdelivr.net/gh/google/code-prettify@e006587b4a893f0281e9dc9a53001c7ed584d4e7/loader/run_prettify.js",
            psd: "https://cdnjs.cloudflare.com/ajax/libs/psd.js/3.4.0/psd.min.js",
            rar: "https://cdn.jsdelivr.net/gh/nao-pon/rar.js@6cef13ec66dd67992fc7f3ea22f132d770ebaf8b/rar.min.js",
            zlibUnzip: "https://cdn.jsdelivr.net/gh/imaya/zlib.js@0.3.1/bin/unzip.min.js",
            zlibGunzip: "https://cdn.jsdelivr.net/gh/imaya/zlib.js@0.3.1/bin/gunzip.min.js",
            bzip2: "https://cdn.jsdelivr.net/gh/nao-pon/bzip2.js@0.8.0/bzip2.js",
            marked: "https://cdnjs.cloudflare.com/ajax/libs/marked/11.1.0/marked.min.js",
            sparkmd5: "https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js",
            jssha: "https://cdnjs.cloudflare.com/ajax/libs/jsSHA/3.3.1/sha.min.js",
            amr: "https://cdn.jsdelivr.net/gh/yxl/opencore-amr-js@dcf3d2b5f384a1d9ded2a54e4c137a81747b222b/js/amrnb.js",
            tiff: "https://cdn.jsdelivr.net/gh/seikichi/tiff.js@545ede3ee46b5a5bc5f06d65954e775aa2a64017/tiff.min.js"
        },
        url: "",
        requestType: "get",
        cors: null,
        parrotHeaders: [],
        requestMaxConn: 3,
        transport: {},
        urlUpload: "",
        dragUploadAllow: "auto",
        overwriteUploadConfirm: !0,
        uploadMaxChunkSize: 10485760,
        folderUploadExclude: {
            win: /^(?:desktop\.ini|thumbs\.db)$/i,
            mac: /^\.ds_store$/i
        },
        iframeTimeout: 0,
        customData: {},
        handlers: {},
        customHeaders: {},
        xhrFields: {},
        lang: "en",
        baseUrl: "",
        i18nBaseUrl: "",
        workerBaseUrl: "",
        cssAutoLoad: !0,
        themes: {},
        theme: null,
        maxErrorDialogs: 5,
        cssClass: "",
        commands: ["*"],
        commandsOptions: {
            getfile: {
                onlyURL: !1,
                multiple: !1,
                folders: !1,
                oncomplete: "",
                onerror: "",
                getPath: !0,
                getImgSize: !1
            },
            open: {
                method: "post",
                into: "window",
                selectAction: "open"
            },
            opennew: {
                url: "",
                useOriginQuery: !0
            },
            upload: {
                ui: "button"
            },
            download: {
                maxRequests: 10,
                minFilesZipdl: 2
            },
            quicklook: {
                autoplay: !0,
                width: 450,
                height: 300,
                mediaControlsList: "",
                pdfToolbar: !0,
                textInitialLines: 100,
                prettifyMaxLines: 300,
                contain: !1,
                docked: 0,
                dockHeight: "auto",
                dockAutoplay: !1,
                googleMapsApiKey: "",
                googleMapsOpts: {
                    maps: {},
                    kml: {
                        suppressInfoWindows: !1,
                        preserveViewport: !1
                    }
                },
                viewerjs: {
                    url: "",
                    mimes: ["application/pdf", "application/vnd.oasis.opendocument.text", "application/vnd.oasis.opendocument.spreadsheet", "application/vnd.oasis.opendocument.presentation"],
                    pdfNative: !0
                },
                sharecadMimes: [],
                googleDocsMimes: [],
                officeOnlineMimes: [],
                getDimThreshold: "200K",
                unzipMaxSize: "50M",
                mimeRegexNotEmptyCheck: /^application\/vnd\.google-apps\./
            },
            edit: {
                dialogWidth: void 0,
                dialogHeight: void 0,
                mimes: [],
                mkfileHideMimes: [],
                makeTextMimes: ["text/plain", "text/css", "text/html"],
                useStoredEditor: !1,
                editorMaximized: !1,
                editors: [],
                encodings: ["Big5", "Big5-HKSCS", "Cp437", "Cp737", "Cp775", "Cp850", "Cp852", "Cp855", "Cp857", "Cp858", "Cp862", "Cp866", "Cp874", "EUC-CN", "EUC-JP", "EUC-KR", "GB18030", "ISO-2022-CN", "ISO-2022-JP", "ISO-2022-KR", "ISO-8859-1", "ISO-8859-2", "ISO-8859-3", "ISO-8859-4", "ISO-8859-5", "ISO-8859-6", "ISO-8859-7", "ISO-8859-8", "ISO-8859-9", "ISO-8859-13", "ISO-8859-15", "KOI8-R", "KOI8-U", "Shift-JIS", "Windows-1250", "Windows-1251", "Windows-1252", "Windows-1253", "Windows-1254", "Windows-1257"],
                extraOptions: {
                    uploadOpts: {},
                    tuiImgEditOpts: {
                        iconsPath: void 0,
                        theme: {}
                    },
                    pixo: {
                        apikey: ""
                    },
                    managerUrl: null,
                    ckeditor: {},
                    ckeditor5: {
                        mode: "decoupled-document"
                    },
                    tinymce: {},
                    onlineConvert: {
                        maxSize: 100,
                        showLink: !0
                    }
                }
            },
            fullscreen: {
                mode: "screen"
            },
            search: {
                incsearch: {
                    enable: !0,
                    minlen: 1,
                    wait: 500
                },
                searchTypes: {
                    SearchMime: {
                        name: "btnMime",
                        title: "searchMime",
                        incsearch: "mime"
                    }
                }
            },
            info: {
                nullUrlDirLinkSelf: !0,
                hideItems: [],
                showHashMaxsize: 104857600,
                showHashAlgorisms: ["md5", "sha256"],
                showHashOpts: {
                    shake128len: 256,
                    shake256len: 512
                },
                custom: {}
            },
            mkdir: {
                intoNewFolderToolbtn: !1
            },
            resize: {
                grid8px: "disable",
                presetSize: [
                    [320, 240],
                    [400, 400],
                    [640, 480],
                    [800, 600]
                ],
                getDimThreshold: 204800,
                dimSubImgSize: 307200
            },
            rm: {
                quickTrash: !0,
                infoCheckWait: 10,
                toTrashMaxItems: 1e3
            },
            paste: {
                moveConfirm: !1
            },
            help: {
                view: ["about", "shortcuts", "help", "integrations", "debug"],
                helpSource: ""
            },
            preference: {
                width: 600,
                height: 400,
                categories: null,
                prefs: null,
                langs: null,
                selectActions: ["open", "edit/download", "resize/edit/download", "download", "quicklook"]
            }
        },
        disabledCmdsRels: {
            get: ["edit"],
            rm: ["cut", "empty"],
            "file&url=": ["download", "zipdl"]
        },
        bootCallback: null,
        getFileCallback: null,
        defaultView: "icons",
        startPathHash: "",
        sound: !0,
        ui: ["toolbar", "places", "tree", "path", "stat"],
        uiOptions: {
            toolbar: [
                ["home", "back", "forward", "up", "reload"],
                ["netmount"],
                ["mkdir", "mkfile", "upload"],
                ["open", "download", "getfile"],
                ["undo", "redo"],
                ["copy", "cut", "paste", "rm", "empty", "hide"],
                ["duplicate", "rename", "edit", "resize", "chmod"],
                ["selectall", "selectnone", "selectinvert"],
                ["quicklook", "info"],
                ["extract", "archive"],
                ["search"],
                ["view", "sort"],
                ["preference", "help"],
                ["fullscreen"]
            ],
            toolbarExtra: {
                displayTextLabel: !1,
                labelExcludeUA: ["Mobile"],
                autoHideUA: ["Mobile"],
                defaultHides: ["home", "reload"],
                showPreferenceButton: "none",
                preferenceInContextmenu: !0
            },
            tree: {
                attrTitle: !0,
                openRootOnLoad: !0,
                openCwdOnOpen: !0,
                syncTree: !0,
                subTreeMax: 100,
                subdirsMaxConn: 2,
                subdirsAtOnce: 5,
                durations: {
                    slideUpDown: "fast",
                    autoScroll: "fast"
                }
            },
            navbar: {
                minWidth: 150,
                maxWidth: 500,
                autoHideUA: []
            },
            navdock: {
                disabled: !1,
                initMaxHeight: "50%",
                maxHeight: "90%"
            },
            cwd: {
                oldSchool: !1,
                showSelectCheckboxUA: ["Touch"],
                metakeyDragout: !0,
                listView: {
                    columns: ["perm", "date", "size", "kind"],
                    columnsCustomName: {},
                    fixedHeader: !0
                },
                iconsView: {
                    size: 0,
                    sizeMax: 3,
                    sizeNames: {
                        0: "viewSmall",
                        1: "viewMedium",
                        2: "viewLarge",
                        3: "viewExtraLarge"
                    }
                }
            },
            path: {
                toWorkzoneWithoutNavbar: !0
            },
            dialog: {
                focusOnMouseOver: !0
            },
            toast: {
                animate: {
                    showMethod: "fadeIn",
                    showDuration: 300,
                    showEasing: "swing",
                    timeOut: 3e3,
                    hideMethod: "fadeOut",
                    hideDuration: 1500,
                    hideEasing: "swing"
                }
            }
        },
        dispInlineRegex: "^(?:(?:image|video|audio)|application/(?:x-mpegURL|dash+xml)|(?:text/plain|application/pdf)$)",
        onlyMimes: [],
        sortRules: {},
        sortType: "name",
        sortOrder: "asc",
        sortStickFolders: !0,
        sortAlsoTreeview: !1,
        clientFormatDate: !0,
        UTCDate: !1,
        dateFormat: "",
        fancyDateFormat: "",
        fileModeStyle: "both",
        width: "auto",
        height: 400,
        noResizeBySelf: !1,
        heightBase: null,
        resizable: !0,
        notifyDelay: 500,
        notifyDialog: {
            position: {},
            width: null,
            canClose: !1,
            hiddens: ["open"]
        },
        dialogContained: !1,
        allowShortcuts: !0,
        rememberLastDir: !0,
        reloadClearHistory: !1,
        useBrowserHistory: !0,
        showFiles: 50,
        showThreshold: 50,
        validName: !1,
        fileFilter: !1,
        backupSuffix: "~",
        sync: 0,
        syncStart: !0,
        loadTmbs: 5,
        cookie: {
            expires: 30,
            domain: "",
            path: "/",
            secure: !1,
            samesite: "lax"
        },
        contextmenu: {
            navbar: ["open", "opennew", "download", "|", "upload", "mkdir", "|", "copy", "cut", "paste", "duplicate", "|", "rm", "empty", "hide", "|", "rename", "|", "archive", "|", "places", "info", "chmod", "netunmount"],
            cwd: ["undo", "redo", "|", "back", "up", "reload", "|", "upload", "mkdir", "mkfile", "paste", "|", "empty", "hide", "|", "view", "sort", "selectall", "colwidth", "|", "places", "info", "chmod", "netunmount", "|", "fullscreen", "|", "preference"],
            files: ["getfile", "|", "open", "opennew", "download", "opendir", "quicklook", "|", "upload", "mkdir", "|", "copy", "cut", "paste", "duplicate", "|", "rm", "empty", "hide", "|", "rename", "edit", "resize", "|", "archive", "extract", "|", "selectall", "selectinvert", "|", "places", "info", "chmod", "netunmount"]
        },
        enableAlways: !1,
        enableByMouseOver: !0,
        windowCloseConfirm: ["hasNotifyDialog", "editingFile"],
        rawStringDecoder: "object" == typeof Encoding && "function" == typeof Encoding.convert ? function (e) {
            return Encoding.convert(e, {
                to: "UNICODE",
                type: "string"
            })
        } : null,
        debug: ["error", "warning", "event-destroy"],
        toastBackendWarn: !0
    }).commandsOptions.netmount = {
            ftp: {
                name: "FTP",
                inputs: {
                    host: st('<input type="text"/>'),
                    port: st('<input type="number" placeholder="21" class="elfinder-input-optional"/>'),
                    path: st('<input type="text" value="/"/>'),
                    user: st('<input type="text"/>'),
                    pass: st('<input type="password" autocomplete="new-password"/>'),
                    FTPS: st('<input type="checkbox" value="1" title="File Transfer Protocol over SSL/TLS"/>'),
                    encoding: st('<input type="text" placeholder="Optional" class="elfinder-input-optional"/>'),
                    locale: st('<input type="text" placeholder="Optional" class="elfinder-input-optional"/>')
                }
            },
            dropbox2: Fe.prototype.makeNetmountOptionOauth("dropbox2", "Dropbox", "Dropbox", {
                noOffline: !0,
                root: "/",
                pathI18n: "path",
                integrate: {
                    title: "Dropbox.com",
                    link: "https://www.dropbox.com"
                }
            }),
            googledrive: Fe.prototype.makeNetmountOptionOauth("googledrive", "Google Drive", "Google", {
                integrate: {
                    title: "Google Drive",
                    link: "https://www.google.com/drive/"
                }
            }),
            onedrive: Fe.prototype.makeNetmountOptionOauth("onedrive", "One Drive", "OneDrive", {
                integrate: {
                    title: "Microsoft OneDrive",
                    link: "https://onedrive.live.com"
                }
            }),
            box: Fe.prototype.makeNetmountOptionOauth("box", "Box", "Box", {
                noOffline: !0,
                integrate: {
                    title: "Box.com",
                    link: "https://www.box.com"
                }
            })
        }, Fe.prototype.history = function (n) {
            function t() {
                s = [n.cwd().hash], r = !(a = 0)
            }

            function e(e) {
                return e && o.canForward() || !e && o.canBack() ? (r = !1, n.exec("open", s[e ? ++a : --a]).fail(t)) : st.Deferred().reject()
            }

            function i(e) {
                !l || l.state && l.state.thash === e || l.pushState({
                    thash: e
                }, null, location.pathname + location.search + (e ? "#elf_" + e : ""))
            }
            var a, o = this,
                r = !0,
                s = [],
                l = n.options.useBrowserHistory && window.history && window.history.pushState ? window.history : null;
            this.canBack = function () {
                return 0 < a
            }, this.canForward = function () {
                return a < s.length - 1
            }, this.back = e, this.forward = function () {
                return e(!0)
            }, n.bind("init", function () {
                l && !l.state && i(n.startDir())
            }).open(function () {
                var e = s.length,
                    t = n.cwd().hash;
                r && (0 <= a && a + 1 < e && s.splice(a + 1), s[s.length - 1] != t && s.push(t), a = s.length - 1), r = !0, i(t)
            }).reload(n.options.reloadClearHistory && t)
        }, Fe.prototype.command = function (t) {
            this.fm = t, this.name = "", this.dialogClass = "", this.className = "", this.title = "", this.linkedCmds = [], this.state = -1, this.alwaysEnabled = !1, this.noChangeDirOnRemovedCwd = !1, this._disabled = !1, this.disableOnSearch = !1, this.updateOnSelect = !0, this.syncTitleOnChange = !1, this.keepContextmenu = !1, this._handlers = {
                enable: function () {
                    this.update(void 0, this.value)
                },
                disable: function () {
                    this.update(-1, this.value)
                },
                "open reload load sync": function () {
                    this._disabled = !(this.alwaysEnabled || this.fm.isCommandEnabled(this.name)), this.update(void 0, this.value), this.change()
                }
            }, this.handlers = {}, this.shortcuts = [], this.options = {
                ui: "button"
            }, this.listeners = [], this.setup = function (e, t) {
                var n, i, a, o = this,
                    r = this.fm;
                for (this.name = e, this.title = r.messages["cmd" + e] ? r.i18n("cmd" + e) : this.extendsCmd && r.messages["cmd" + this.extendsCmd] ? r.i18n("cmd" + this.extendsCmd) : e, this.options = Object.assign({}, this.options, t), this.listeners = [], this.dialogClass = "elfinder-dialog-" + e, t.shortcuts && ("function" == typeof t.shortcuts ? a = t.shortcuts(this.fm, this.shortcuts) : Array.isArray(t.shortcuts) && (a = t.shortcuts), this.shortcuts = a || []), this.updateOnSelect && (this._handlers.select = function () {
                    this.update(void 0, this.value)
                }), st.each(Object.assign({}, o._handlers, o.handlers), function (e, t) {
                    r.bind(e, st.proxy(t, o))
                }), n = 0; n < this.shortcuts.length; n++) ! function (e) {
                    var i = e.callback || function (e) {
                        r.exec(o.name, void 0, {
                            _userAction: !0,
                            _currentType: "shortcut"
                        })
                    };
                    e.callback = function (e) {
                        var t, n = {};
                        o.enabled() && (r.searchStatus.state < 2 ? t = r.isCommandEnabled(o.name) : (st.each(r.selected(), function (e, t) {
                            r.optionsByHashes[t] ? n[t] = !0 : st.each(r.volOptions, function (e) {
                                if (!n[e] && 0 === t.indexOf(e)) return !(n[e] = !0)
                            })
                        }), st.each(n, function (e) {
                            if (!(t = r.isCommandEnabled(o.name, e))) return !1
                        })), t && (o.event = e, i.call(o), delete o.event))
                    }
                }(i = this.shortcuts[n]), i.description || (i.description = this.title), r.shortcut(i);
                this.disableOnSearch && r.bind("search searchend", function () {
                    o._disabled = "search" === this.type || !(this.alwaysEnabled || r.isCommandEnabled(e)), o.update(void 0, o.value)
                }), this.init()
            }, this.init = function () { }, this.exec = function (e, t) {
                return st.Deferred().reject()
            }, this.getUndo = function (e, t) {
                return !1
            }, this.disabled = function () {
                return this.state < 0
            }, this.enabled = function () {
                return -1 < this.state
            }, this.active = function () {
                return 0 < this.state
            }, this.getstate = function () {
                return -1
            }, this.update = function (e, t) {
                var n = this.state,
                    i = this.value;
                this._disabled && 0 === this.fm.searchStatus ? this.state = -1 : this.state = void 0 !== e ? e : this.getstate(), this.value = t, n == this.state && i == this.value || this.change()
            }, this.change = function (e) {
                var t, n;
                if ("function" == typeof e) this.listeners.push(e);
                else
                    for (n = 0; n < this.listeners.length; n++) {
                        t = this.listeners[n];
                        try {
                            t(this.state, this.value)
                        } catch (e) {
                            this.fm.debug("error", e)
                        }
                    }
                return this
            }, this.hashes = function (e) {
                return e ? st.grep(Array.isArray(e) ? e : [e], function (e) {
                    return !!t.file(e)
                }) : t.selected()
            }, this.files = function (e) {
                var t = this.fm;
                return e ? st.map(Array.isArray(e) ? e : [e], function (e) {
                    return t.file(e) || null
                }) : t.selectedFiles()
            }, this.fmDialog = function (e, t) {
                return t.cssClass ? t.cssClass += " " + this.dialogClass : t.cssClass = this.dialogClass, this.fm.dialog(e, t)
            }
        }, Fe.prototype.resources = {
            class: {
                hover: "ui-state-hover",
                active: "ui-state-active",
                disabled: "ui-state-disabled",
                draggable: "ui-draggable",
                droppable: "ui-droppable",
                adroppable: "elfinder-droppable-active",
                cwdfile: "elfinder-cwd-file",
                cwd: "elfinder-cwd",
                tree: "elfinder-tree",
                treeroot: "elfinder-navbar-root",
                navdir: "elfinder-navbar-dir",
                navdirwrap: "elfinder-navbar-dir-wrapper",
                navarrow: "elfinder-navbar-arrow",
                navsubtree: "elfinder-navbar-subtree",
                navcollapse: "elfinder-navbar-collapsed",
                navexpand: "elfinder-navbar-expanded",
                treedir: "elfinder-tree-dir",
                placedir: "elfinder-place-dir",
                searchbtn: "elfinder-button-search",
                editing: "elfinder-to-editing",
                preventback: "elfinder-prevent-back",
                tabstab: "ui-state-default ui-tabs-tab ui-corner-top ui-tab",
                tabsactive: "ui-tabs-active ui-state-active"
            },
            tpl: {
                perms: '<span class="elfinder-perms"></span>',
                lock: '<span class="elfinder-lock"></span>',
                symlink: '<span class="elfinder-symlink"></span>',
                navicon: '<span class="elfinder-nav-icon"></span>',
                navspinner: '<span class="elfinder-spinner elfinder-navbar-spinner"></span>',
                navdir: '<div class="elfinder-navbar-wrapper{root}"><span id="{id}" class="ui-corner-all elfinder-navbar-dir {cssclass}"{title}><span class="elfinder-navbar-arrow"></span><span class="elfinder-navbar-icon" {style}></span>{symlink}{permissions}{name}</span><div class="elfinder-navbar-subtree" style="display:none"></div></div>',
                placedir: '<div class="elfinder-navbar-wrapper"><span id="{id}" class="ui-corner-all elfinder-navbar-dir {cssclass}"{title}><span class="elfinder-navbar-arrow"></span><span class="elfinder-navbar-icon" {style}></span>{symlink}{permissions}{name}</span><div class="elfinder-navbar-subtree" style="display:none"></div></div>'
            },
            mimes: {
                text: ["application/dash+xml", "application/docbook+xml", "application/javascript", "application/json", "application/plt", "application/sat", "application/sql", "application/step", "application/vnd.hp-hpgl", "application/x-awk", "application/x-config", "application/x-csh", "application/x-empty", "application/x-mpegurl", "application/x-perl", "application/x-php", "application/x-web-config", "application/xhtml+xml", "application/xml", "audio/x-mp3-playlist", "image/cgm", "image/svg+xml", "image/vnd.dxf", "model/iges"]
            },
            mixin: {
                make: function () {
                    function i() {
                        S.is(":hidden") || S.elfinderoverlay("hide").off("click close", I), t && (a.removeClass("ui-front").css("position", "").off("unselect." + d.namespace, x), v ? t && t.css("max-height", "") : m || a.css("width", "").parent("td").css("overflow", ""))
                    }
                    var e, t, a, s, n, o, r, l, c = this,
                        d = this.fm,
                        p = this.name,
                        u = this.requestCmd || p,
                        h = d.getUI("workzone"),
                        f = this.origin && "navbar" === this.origin ? "tree" : "cwd",
                        m = "tree" == f,
                        g = m ? "navHash2Elm" : "cwdHash2Elm",
                        v = !m && "list" != d.storage("view"),
                        b = d.selected(),
                        y = this.move || !1,
                        w = h.hasClass("elfinder-cwd-wrapper-empty"),
                        x = function () {
                            requestAnimationFrame(function () {
                                M && M.trigger("blur")
                            })
                        },
                        k = st.Deferred().fail(function (e) {
                            o && n.attr("class", o), w && h.addClass("elfinder-cwd-wrapper-empty"), b && (y && d.trigger("unlockfiles", {
                                files: b
                            }), d.clipboard([]), d.trigger("selectfiles", {
                                files: b
                            })), e && d.error(e)
                        }).always(function () {
                            i(), O(), d.enable().unbind("open", F).trigger("resMixinMake")
                        }),
                        C = "tmp_" + parseInt(1e5 * Math.random()),
                        z = this.data && this.data.target ? this.data.target : (m ? d.file(b[0]) : d.cwd()).hash,
                        T = new Date,
                        A = {
                            hash: C,
                            phash: z,
                            name: d.uniqueName(this.prefix, z),
                            mime: this.mime,
                            read: !0,
                            write: !0,
                            date: "Today " + T.getHours() + ":" + T.getMinutes(),
                            move: y
                        },
                        P = (d.getUI(f).trigger("create." + d.namespace, A), this.data || {}),
                        j = d[g](C),
                        S = d.getUI("overlay"),
                        O = function () {
                            j && j.length && (M.off(), j.hide(), d.unselectfiles({
                                files: [C]
                            }).unbind("resize", D), requestAnimationFrame(function () {
                                (m ? j.closest(".elfinder-navbar-wrapper") : j).remove()
                            }))
                        },
                        I = function (e) {
                            S.is(":hidden") || a.css("z-index", ""), U || (O(), k.reject(), e && (e.stopPropagation(), e.preventDefault()))
                        },
                        M = st(v ? "<textarea></textarea>" : '<input type="text"/>').on("keyup text", function () {
                            v ? (this.style.height = "1px", this.style.height = this.scrollHeight + "px") : e && (this.style.width = e + "px", this.scrollWidth > e && (this.style.width = this.scrollWidth + 10 + "px"))
                        }).on("keydown", function (e) {
                            e.stopImmediatePropagation(), e.keyCode == st.ui.keyCode.ESCAPE ? k.reject() : e.keyCode == st.ui.keyCode.ENTER && (e.preventDefault(), M.trigger("blur"))
                        }).on("mousedown click dblclick", function (e) {
                            e.stopPropagation(), "dblclick" === e.type && e.preventDefault()
                        }).on("blur", function () {
                            var e = st.trim(M.val()),
                                t = M.parent(),
                                n = !0;
                            if (S.is(":hidden") || a.css("z-index", ""), "" === e) return I();
                            if (!U && t.length) {
                                if (d.options.validName && d.options.validName.test) try {
                                    n = d.options.validName.test(e)
                                } catch (e) {
                                    n = !1
                                }
                                return e && "." !== e && ".." !== e && n ? d.fileByName(e, z) ? (U = !0, d.error(["errExists", e], {
                                    modal: !0,
                                    close: function () {
                                        setTimeout(E, 120)
                                    }
                                }), !1) : (t = b && y ? d.exec("cut", b) : null, void st.when(t).done(function () {
                                    var o = {},
                                        r = {};
                                    i(), M.hide().before(st("<span>").text(e)), d.lockfiles({
                                        files: [C]
                                    }), d.request({
                                        data: Object.assign({
                                            cmd: u,
                                            name: e,
                                            target: z
                                        }, P || {}),
                                        notify: {
                                            type: u,
                                            cnt: 1
                                        },
                                        preventFail: !0,
                                        syncOnFail: !0,
                                        navigate: {
                                            toast: o
                                        }
                                    }).fail(function (e) {
                                        d.unlockfiles({
                                            files: [C]
                                        }), U = !0, M.show().prev().remove(), d.error(e, {
                                            modal: !0,
                                            close: function () {
                                                Array.isArray(e) && -1 !== st.inArray("errUploadMime", e) ? k.notify("errUploadMime").reject() : setTimeout(E, 120)
                                            }
                                        })
                                    }).done(function (e) {
                                        var t, n, i, a;
                                        e && e.added && e.added[0] && (t = e.added[0], n = t.hash, d[g](n), i = {
                                            directory: {
                                                cmd: "open",
                                                msg: "cmdopendir"
                                            },
                                            text: {
                                                cmd: "edit",
                                                msg: "cmdedit"
                                            },
                                            default: {
                                                cmd: "open",
                                                msg: "cmdopen"
                                            }
                                        }, b && y && d.one(u + "done", function () {
                                            d.exec("paste", n)
                                        }), y || (d.mimeIsText(t.mime) && !d.mimesCanMakeEmpty[t.mime] && d.mimeTypes[t.mime] && (d.trigger("canMakeEmptyFile", {
                                            mimes: [t.mime],
                                            unshift: !0
                                        }), (a = {})[t.mime] = d.mimeTypes[t.mime], d.storage("mkfileTextMimes", Object.assign(a, d.storage("mkfileTextMimes") || {}))), Object.assign(r, s || i[t.mime] || i[t.mime.split("/")[0]] || i[d.mimesCanMakeEmpty[t.mime] || -1 !== st.inArray(t.mime, d.resources.mimes.text) ? "text" : "none"] || i.default), Object.assign(o, r.cmd ? {
                                            incwd: {
                                                msg: d.i18n(["complete", d.i18n("cmd" + p)]),
                                                action: r
                                            },
                                            inbuffer: {
                                                msg: d.i18n(["complete", d.i18n("cmd" + p)]),
                                                action: r
                                            }
                                        } : {
                                            inbuffer: {
                                                msg: d.i18n(["complete", d.i18n("cmd" + p)])
                                            }
                                        }))), k.resolve(e)
                                    })
                                }).fail(function () {
                                    k.reject()
                                })) : (U = !0, d.error("directory" === A.mime ? "errInvDirname" : "errInvName", {
                                    modal: !0,
                                    close: function () {
                                        setTimeout(E, 120)
                                    }
                                }), !1)
                            }
                        }).on("dragenter dragleave dragover drop", function (e) {
                            e.stopPropagation()
                        }),
                        E = function () {
                            var e = d.splitFileExtention(M.val())[0];
                            U || !d.UA.Mobile || d.UA.iOS || (S.on("click close", I).elfinderoverlay("show"), a.css("z-index", S.css("z-index") + 1)), U = !1, d.enabled() || d.enable(), M.trigger("focus").trigger("select"), M[0].setSelectionRange && M[0].setSelectionRange(0, e.length)
                        },
                        D = function () {
                            j.trigger("scrolltoview", {
                                blink: !1
                            })
                        },
                        F = function () {
                            k && "pending" === k.state() && k.reject()
                        },
                        U = !1;
                    return d.isCommandEnabled(u, z) && j.length ? (st.isPlainObject(c.nextAction) && (s = Object.assign({}, c.nextAction)), m ? (n = d[g](z), T = d.res("class", "navcollapse"), f = d.res("class", "navexpand"), r = d.res("class", "navarrow"), l = d.res("class", "navsubtree"), j.closest("." + l).show(), n.hasClass(T) || (o = n.attr("class"), n.addClass(T + " " + f + " elfinder-subtree-loaded")), n.is("." + T + ":not(." + f + ")") && n.children("." + r).trigger("click").data("dfrd").done(function () {
                        M.val() === A.name && M.val(d.uniqueName(c.prefix, z)).trigger("select").trigger("focus")
                    }), t = j.contents().filter(function () {
                        return 3 == this.nodeType && st(this).parent().attr("id") === d.navHash2Id(A.hash)
                    }), a = t.parent(), t.replaceWith(M.val(A.name))) : (w && h.removeClass("elfinder-cwd-wrapper-empty"), t = j.find(".elfinder-cwd-filename"), a = t.parent(), v ? t.css("max-height", "none") : (e = a.width(), a.width(e - 15).parent("td").css("overflow", "visible")), t.empty().append(M.val(A.name))), a.addClass("ui-front").css("position", "relative").on("unselect." + d.namespace, x), d.bind("resize", D).one("open", F), M.trigger("keyup"), E(), k) : k.reject()
                }
            },
            blink: function (e, t) {
                var n = {
                    slowonce: function () {
                        e.hide().delay(250).fadeIn(750).delay(500).fadeOut(3500)
                    },
                    lookme: function () {
                        e.show().fadeOut(500).fadeIn(750)
                    }
                },
                    t = n[t = t || "slowonce"] || n.lookme;
                e.stop(!0, !0), t()
            }
        }, st.fn.dialogelfinder = function (e, t) {
            var n, i, r = "elfinderPosition",
                s = "elfinderDestroyOnClose";
            if (st.isPlainObject(e)) this.not(".elfinder").each(function () {
                e.handlers = e.handlers || {};
                var n, i = st(this),
                    a = (st(document), st('<div class="ui-widget-header dialogelfinder-drag ui-corner-top">' + (e.title || "Files") + "</div>")),
                    o = (st('<a href="#" class="dialogelfinder-drag-close ui-corner-all"><span class="ui-icon ui-icon-closethick"> </span></a>').appendTo(a).on("click", function (e) {
                        e.preventDefault(), i.dialogelfinder("close")
                    }), e.handlers.init);
                e.handlers.init = function (e, t) {
                    i.prepend(a), o && o(e, t)
                }, (n = i.addClass("elfinder dialogelfinder touch-punch").css("position", "absolute").hide().appendTo("body").draggable({
                    handle: ".dialogelfinder-drag",
                    containment: "window",
                    stop: function () {
                        i.trigger("resize"), n.trigger("resize")
                    }
                }).elfinder(e, t).elfinder("instance")).reloadCallback = function (e, t) {
                    n.destroy(), e.handlers.init = o, i.dialogelfinder(e, t).dialogelfinder("open")
                }, i.width(parseInt(i.width()) || 840).data(s, !!e.destroyOnClose).find(".elfinder-toolbar").removeClass("ui-corner-top"), e.position && i.data(r, e.position), !1 !== e.autoOpen && st(this).dialogelfinder("open")
            });
            else if ("open" === e) i = (n = st(this)).data(r) || {
                top: parseInt(st(document).scrollTop() + (st(window).height() < n.height() ? 2 : (st(window).height() - n.height()) / 2)),
                left: parseInt(st(document).scrollLeft() + (st(window).width() < n.width() ? 2 : (st(window).width() - n.width()) / 2))
            }, n.is(":hidden") && (n.addClass("ui-front").css(i).show().trigger("resize"), setTimeout(function () {
                n.trigger("resize").trigger("mousedown")
            }, 200));
            else if ("close" === e) (n = st(this).removeClass("ui-front")).is(":visible") && (n.data(s) ? n.elfinder("destroy").remove() : n.elfinder("close"));
            else if ("instance" === e) return st(this).getElFinder();
            return this
        }, Fe.prototype.i18 && (Fe.prototype.i18.en = {
            translator: "Troex Nevelin &lt;troex@fury.scancode.ru&gt;, Naoki Sawada &lt;hypweb+elfinder@gmail.com&gt;",
            language: "English",
            direction: "ltr",
            dateFormat: "M d, Y h:i A",
            fancyDateFormat: "$1 h:i A",
            nonameDateFormat: "ymd-His",
            messages: {
                error: "Error",
                errUnknown: "Unknown error.",
                errUnknownCmd: "Unknown command.",
                errJqui: "Invalid jQuery UI configuration. Selectable, draggable and droppable components must be included.",
                errNode: "elFinder requires DOM Element to be created.",
                errURL: "Invalid elFinder configuration! URL option is not set.",
                errAccess: "Access denied.",
                errConnect: "Unable to connect to backend.",
                errAbort: "Connection aborted.",
                errTimeout: "Connection timeout.",
                errNotFound: "Backend not found.",
                errResponse: "Invalid backend response.",
                errConf: "Invalid backend configuration.",
                errJSON: "PHP JSON module not installed.",
                errNoVolumes: "Readable volumes not available.",
                errCmdParams: 'Invalid parameters for command "$1".',
                errDataNotJSON: "Data is not JSON.",
                errDataEmpty: "Data is empty.",
                errCmdReq: "Backend request requires command name.",
                errOpen: 'Unable to open "$1".',
                errNotFolder: "Object is not a folder.",
                errNotFile: "Object is not a file.",
                errRead: 'Unable to read "$1".',
                errWrite: 'Unable to write into "$1".',
                errPerm: "Permission denied.",
                errLocked: '"$1" is locked and can not be renamed, moved or removed.',
                errExists: 'Item named "$1" already exists.',
                errInvName: "Invalid file name.",
                errInvDirname: "Invalid folder name.",
                errFolderNotFound: "Folder not found.",
                errFileNotFound: "File not found.",
                errTrgFolderNotFound: 'Target folder "$1" not found.',
                errPopup: "Browser prevented opening popup window. To open file enable it in browser options.",
                errMkdir: 'Unable to create folder "$1".',
                errMkfile: 'Unable to create file "$1".',
                errRename: 'Unable to rename "$1".',
                errCopyFrom: 'Copying files from volume "$1" not allowed.',
                errCopyTo: 'Copying files to volume "$1" not allowed.',
                errMkOutLink: "Unable to create a link to outside the volume root.",
                errUpload: "Upload error.",
                errUploadFile: 'Unable to upload "$1".',
                errUploadNoFiles: "No files found for upload.",
                errUploadTotalSize: "Data exceeds the maximum allowed size.",
                errUploadFileSize: "File exceeds maximum allowed size.",
                errUploadMime: "File type not allowed.",
                errUploadTransfer: '"$1" transfer error.',
                errUploadTemp: "Unable to make temporary file for upload.",
                errNotReplace: 'Object "$1" already exists at this location and can not be replaced by object with another type.',
                errReplace: 'Unable to replace "$1".',
                errSave: 'Unable to save "$1".',
                errCopy: 'Unable to copy "$1".',
                errMove: 'Unable to move "$1".',
                errCopyInItself: 'Unable to copy "$1" into itself.',
                errRm: 'Unable to remove "$1".',
                errTrash: "Unable into trash.",
                errRmSrc: "Unable remove source file(s).",
                errExtract: 'Unable to extract files from "$1".',
                errArchive: "Unable to create archive.",
                errArcType: "Unsupported archive type.",
                errNoArchive: "File is not archive or has unsupported archive type.",
                errCmdNoSupport: "Backend does not support this command.",
                errReplByChild: 'The folder "$1" can\'t be replaced by an item it contains.',
                errArcSymlinks: "For security reason denied to unpack archives contains symlinks or files with not allowed names.",
                errArcMaxSize: "Archive files exceeds maximum allowed size.",
                errResize: 'Unable to resize "$1".',
                errResizeDegree: "Invalid rotate degree.",
                errResizeRotate: "Unable to rotate image.",
                errResizeSize: "Invalid image size.",
                errResizeNoChange: "Image size not changed.",
                errUsupportType: "Unsupported file type.",
                errNotUTF8Content: 'File "$1" is not in UTF-8 and cannot be edited.',
                errNetMount: 'Unable to mount "$1".',
                errNetMountNoDriver: "Unsupported protocol.",
                errNetMountFailed: "Mount failed.",
                errNetMountHostReq: "Host required.",
                errSessionExpires: "Your session has expired due to inactivity.",
                errCreatingTempDir: 'Unable to create temporary directory: "$1"',
                errFtpDownloadFile: 'Unable to download file from FTP: "$1"',
                errFtpUploadFile: 'Unable to upload file to FTP: "$1"',
                errFtpMkdir: 'Unable to create remote directory on FTP: "$1"',
                errArchiveExec: 'Error while archiving files: "$1"',
                errExtractExec: 'Error while extracting files: "$1"',
                errNetUnMount: "Unable to unmount.",
                errConvUTF8: "Not convertible to UTF-8",
                errFolderUpload: "Try the modern browser, If you'd like to upload the folder.",
                errSearchTimeout: 'Timed out while searching "$1". Search result is partial.',
                errReauthRequire: "Re-authorization is required.",
                errMaxTargets: "Max number of selectable items is $1.",
                errRestore: "Unable to restore from the trash. Can't identify the restore destination.",
                errEditorNotFound: "Editor not found to this file type.",
                errServerError: "Error occurred on the server side.",
                errEmpty: 'Unable to empty folder "$1".',
                moreErrors: "There are $1 more errors.",
                errMaxMkdirs: "You can create up to $1 folders at one time.",
                cmdarchive: "Create archive",
                cmdback: "Back",
                cmdcopy: "Copy",
                cmdcut: "Cut",
                cmddownload: "Download",
                cmdduplicate: "Duplicate",
                cmdedit: "Edit file",
                cmdextract: "Extract files from archive",
                cmdforward: "Forward",
                cmdgetfile: "Select files",
                cmdhelp: "About this software",
                cmdhome: "Root",
                cmdinfo: "Get info",
                cmdmkdir: "New folder",
                cmdmkdirin: "Into New Folder",
                cmdmkfile: "New file",
                cmdopen: "Open",
                cmdpaste: "Paste",
                cmdquicklook: "Preview",
                cmdreload: "Reload",
                cmdrename: "Rename",
                cmdrm: "Delete",
                cmdtrash: "Into trash",
                cmdrestore: "Restore",
                cmdsearch: "Find files",
                cmdup: "Go to parent folder",
                cmdupload: "Upload files",
                cmdview: "View",
                cmdresize: "Resize & Rotate",
                cmdsort: "Sort",
                cmdnetmount: "Mount network volume",
                cmdnetunmount: "Unmount",
                cmdplaces: "To Places",
                cmdchmod: "Change mode",
                cmdopendir: "Open a folder",
                cmdcolwidth: "Reset column width",
                cmdfullscreen: "Full Screen",
                cmdmove: "Move",
                cmdempty: "Empty the folder",
                cmdundo: "Undo",
                cmdredo: "Redo",
                cmdpreference: "Preferences",
                cmdselectall: "Select all",
                cmdselectnone: "Select none",
                cmdselectinvert: "Invert selection",
                cmdopennew: "Open in new window",
                cmdhide: "Hide (Preference)",
                btnClose: "Close",
                btnSave: "Save",
                btnRm: "Remove",
                btnApply: "Apply",
                btnCancel: "Cancel",
                btnNo: "No",
                btnYes: "Yes",
                btnMount: "Mount",
                btnApprove: "Goto $1 & approve",
                btnUnmount: "Unmount",
                btnConv: "Convert",
                btnCwd: "Here",
                btnVolume: "Volume",
                btnAll: "All",
                btnMime: "MIME Type",
                btnFileName: "Filename",
                btnSaveClose: "Save & Close",
                btnBackup: "Backup",
                btnRename: "Rename",
                btnRenameAll: "Rename(All)",
                btnPrevious: "Prev ($1/$2)",
                btnNext: "Next ($1/$2)",
                btnSaveAs: "Save As",
                ntfopen: "Open folder",
                ntffile: "Open file",
                ntfreload: "Reload folder content",
                ntfmkdir: "Creating folder",
                ntfmkfile: "Creating files",
                ntfrm: "Delete items",
                ntfcopy: "Copy items",
                ntfmove: "Move items",
                ntfprepare: "Checking existing items",
                ntfrename: "Rename files",
                ntfupload: "Uploading files",
                ntfdownload: "Downloading files",
                ntfsave: "Save files",
                ntfarchive: "Creating archive",
                ntfextract: "Extracting files from archive",
                ntfsearch: "Searching files",
                ntfresize: "Resizing images",
                ntfsmth: "Doing something",
                ntfloadimg: "Loading image",
                ntfnetmount: "Mounting network volume",
                ntfnetunmount: "Unmounting network volume",
                ntfdim: "Acquiring image dimension",
                ntfreaddir: "Reading folder infomation",
                ntfurl: "Getting URL of link",
                ntfchmod: "Changing file mode",
                ntfpreupload: "Verifying upload file name",
                ntfzipdl: "Creating a file for download",
                ntfparents: "Getting path infomation",
                ntfchunkmerge: "Processing the uploaded file",
                ntftrash: "Doing throw in the trash",
                ntfrestore: "Doing restore from the trash",
                ntfchkdir: "Checking destination folder",
                ntfundo: "Undoing previous operation",
                ntfredo: "Redoing previous undone",
                ntfchkcontent: "Checking contents",
                volume_Trash: "Trash",
                dateUnknown: "unknown",
                Today: "Today",
                Yesterday: "Yesterday",
                msJan: "Jan",
                msFeb: "Feb",
                msMar: "Mar",
                msApr: "Apr",
                msMay: "May",
                msJun: "Jun",
                msJul: "Jul",
                msAug: "Aug",
                msSep: "Sep",
                msOct: "Oct",
                msNov: "Nov",
                msDec: "Dec",
                January: "January",
                February: "February",
                March: "March",
                April: "April",
                May: "May",
                June: "June",
                July: "July",
                August: "August",
                September: "September",
                October: "October",
                November: "November",
                December: "December",
                Sunday: "Sunday",
                Monday: "Monday",
                Tuesday: "Tuesday",
                Wednesday: "Wednesday",
                Thursday: "Thursday",
                Friday: "Friday",
                Saturday: "Saturday",
                Sun: "Sun",
                Mon: "Mon",
                Tue: "Tue",
                Wed: "Wed",
                Thu: "Thu",
                Fri: "Fri",
                Sat: "Sat",
                sortname: "by name",
                sortkind: "by kind",
                sortsize: "by size",
                sortdate: "by date",
                sortFoldersFirst: "Folders first",
                sortperm: "by permission",
                sortmode: "by mode",
                sortowner: "by owner",
                sortgroup: "by group",
                sortAlsoTreeview: "Also Treeview",
                "untitled file.txt": "NewFile.txt",
                "untitled folder": "NewFolder",
                Archive: "NewArchive",
                "untitled file": "NewFile.$1",
                extentionfile: "$1: File",
                extentiontype: "$1: $2",
                confirmReq: "Confirmation required",
                confirmRm: "Are you sure you want to permanently remove items?<br/>This cannot be undone!",
                confirmRepl: "Replace old file with new one? (If it contains folders, it will be merged. To backup and replace, select Backup.)",
                confirmRest: "Replace existing item with the item in trash?",
                confirmConvUTF8: "Not in UTF-8<br/>Convert to UTF-8?<br/>Contents become UTF-8 by saving after conversion.",
                confirmNonUTF8: "Character encoding of this file couldn't be detected. It need to temporarily convert to UTF-8 for editting.<br/>Please select character encoding of this file.",
                confirmNotSave: "It has been modified.<br/>Losing work if you do not save changes.",
                confirmTrash: "Are you sure you want to move items to trash bin?",
                confirmMove: 'Are you sure you want to move items to "$1"?',
                apllyAll: "Apply to all",
                name: "Name",
                size: "Size",
                perms: "Permissions",
                modify: "Modified",
                kind: "Kind",
                read: "read",
                write: "write",
                noaccess: "no access",
                and: "and",
                unknown: "unknown",
                selectall: "Select all items",
                selectfiles: "Select item(s)",
                selectffile: "Select first item",
                selectlfile: "Select last item",
                viewlist: "List view",
                viewicons: "Icons view",
                viewSmall: "Small icons",
                viewMedium: "Medium icons",
                viewLarge: "Large icons",
                viewExtraLarge: "Extra large icons",
                places: "Places",
                calc: "Calculate",
                path: "Path",
                aliasfor: "Alias for",
                locked: "Locked",
                dim: "Dimensions",
                files: "Files",
                folders: "Folders",
                items: "Items",
                yes: "yes",
                no: "no",
                link: "Link",
                searcresult: "Search results",
                selected: "selected items",
                about: "About",
                shortcuts: "Shortcuts",
                help: "Help",
                webfm: "Web file manager",
                ver: "Version",
                protocolver: "protocol version",
                homepage: "Project home",
                docs: "Documentation",
                github: "Fork us on GitHub",
                twitter: "Follow us on Twitter",
                facebook: "Join us on Facebook",
                team: "Team",
                chiefdev: "chief developer",
                developer: "developer",
                contributor: "contributor",
                maintainer: "maintainer",
                translator: "translator",
                icons: "Icons",
                dontforget: "and don't forget to take your towel",
                shortcutsof: "Shortcuts disabled",
                dropFiles: "Drop files here",
                or: "or",
                selectForUpload: "Select files",
                moveFiles: "Move items",
                copyFiles: "Copy items",
                restoreFiles: "Restore items",
                rmFromPlaces: "Remove from places",
                aspectRatio: "Aspect ratio",
                scale: "Scale",
                width: "Width",
                height: "Height",
                resize: "Resize",
                crop: "Crop",
                rotate: "Rotate",
                "rotate-cw": "Rotate 90 degrees CW",
                "rotate-ccw": "Rotate 90 degrees CCW",
                degree: "°",
                netMountDialogTitle: "Mount network volume",
                protocol: "Protocol",
                host: "Host",
                port: "Port",
                user: "User",
                pass: "Password",
                confirmUnmount: "Are you sure to unmount $1?",
                dropFilesBrowser: "Drop or Paste files from browser",
                dropPasteFiles: "Drop files, Paste URLs or images(clipboard) here",
                encoding: "Encoding",
                locale: "Locale",
                searchTarget: "Target: $1",
                searchMime: "Search by input MIME Type",
                owner: "Owner",
                group: "Group",
                other: "Other",
                execute: "Execute",
                perm: "Permission",
                mode: "Mode",
                emptyFolder: "Folder is empty",
                emptyFolderDrop: "Folder is empty\\A Drop to add items",
                emptyFolderLTap: "Folder is empty\\A Long tap to add items",
                quality: "Quality",
                autoSync: "Auto sync",
                moveUp: "Move up",
                getLink: "Get URL link",
                selectedItems: "Selected items ($1)",
                folderId: "Folder ID",
                offlineAccess: "Allow offline access",
                reAuth: "To re-authenticate",
                nowLoading: "Now loading...",
                openMulti: "Open multiple files",
                openMultiConfirm: "You are trying to open the $1 files. Are you sure you want to open in browser?",
                emptySearch: "Search results is empty in search target.",
                editingFile: "It is editing a file.",
                hasSelected: "You have selected $1 items.",
                hasClipboard: "You have $1 items in the clipboard.",
                incSearchOnly: "Incremental search is only from the current view.",
                reinstate: "Reinstate",
                complete: "$1 complete",
                contextmenu: "Context menu",
                pageTurning: "Page turning",
                volumeRoots: "Volume roots",
                reset: "Reset",
                bgcolor: "Background color",
                colorPicker: "Color picker",
                "8pxgrid": "8px Grid",
                enabled: "Enabled",
                disabled: "Disabled",
                emptyIncSearch: "Search results is empty in current view.\\A Press [Enter] to expand search target.",
                emptyLetSearch: "First letter search results is empty in current view.",
                textLabel: "Text label",
                minsLeft: "$1 mins left",
                openAsEncoding: "Reopen with selected encoding",
                saveAsEncoding: "Save with the selected encoding",
                selectFolder: "Select folder",
                firstLetterSearch: "First letter search",
                presets: "Presets",
                tooManyToTrash: "It's too many items so it can't into trash.",
                TextArea: "TextArea",
                folderToEmpty: 'Empty the folder "$1".',
                filderIsEmpty: 'There are no items in a folder "$1".',
                preference: "Preference",
                language: "Language",
                clearBrowserData: "Initialize the settings saved in this browser",
                toolbarPref: "Toolbar settings",
                charsLeft: "... $1 chars left.",
                linesLeft: "... $1 lines left.",
                sum: "Sum",
                roughFileSize: "Rough file size",
                autoFocusDialog: "Focus on the element of dialog with mouseover",
                select: "Select",
                selectAction: "Action when select file",
                useStoredEditor: "Open with the editor used last time",
                selectinvert: "Invert selection",
                renameMultiple: "Are you sure you want to rename $1 selected items like $2?<br/>This cannot be undone!",
                batchRename: "Batch rename",
                plusNumber: "+ Number",
                asPrefix: "Add prefix",
                asSuffix: "Add suffix",
                changeExtention: "Change extention",
                columnPref: "Columns settings (List view)",
                reflectOnImmediate: "All changes will reflect immediately to the archive.",
                reflectOnUnmount: "Any changes will not reflect until un-mount this volume.",
                unmountChildren: "The following volume(s) mounted on this volume also unmounted. Are you sure to unmount it?",
                selectionInfo: "Selection Info",
                hashChecker: "Algorithms to show the file hash",
                infoItems: "Info Items (Selection Info Panel)",
                pressAgainToExit: "Press again to exit.",
                toolbar: "Toolbar",
                workspace: "Work Space",
                dialog: "Dialog",
                all: "All",
                iconSize: "Icon Size (Icons view)",
                editorMaximized: "Open the maximized editor window",
                editorConvNoApi: "Because conversion by API is not currently available, please convert on the website.",
                editorConvNeedUpload: "After conversion, you must be upload with the item URL or a downloaded file to save the converted file.",
                convertOn: "Convert on the site of $1",
                integrations: "Integrations",
                integrationWith: "This elFinder has the following external services integrated. Please check the terms of use, privacy policy, etc. before using it.",
                showHidden: "Show hidden items",
                hideHidden: "Hide hidden items",
                toggleHidden: "Show/Hide hidden items",
                makefileTypes: 'File types to enable with "New file"',
                typeOfTextfile: "Type of the Text file",
                add: "Add",
                theme: "Theme",
                default: "Default",
                description: "Description",
                website: "Website",
                author: "Author",
                email: "Email",
                license: "License",
                exportToSave: "This item can't be saved. To avoid losing the edits you need to export to your PC.",
                dblclickToSelect: "Double click on the file to select it.",
                useFullscreen: "Use fullscreen mode",
                kindUnknown: "Unknown",
                kindRoot: "Volume Root",
                kindFolder: "Folder",
                kindSelects: "Selections",
                kindAlias: "Alias",
                kindAliasBroken: "Broken alias",
                kindApp: "Application",
                kindPostscript: "Postscript document",
                kindMsOffice: "Microsoft Office document",
                kindMsWord: "Microsoft Word document",
                kindMsExcel: "Microsoft Excel document",
                kindMsPP: "Microsoft Powerpoint presentation",
                kindOO: "Open Office document",
                kindAppFlash: "Flash application",
                kindPDF: "Portable Document Format (PDF)",
                kindTorrent: "Bittorrent file",
                kind7z: "7z archive",
                kindTAR: "TAR archive",
                kindGZIP: "GZIP archive",
                kindBZIP: "BZIP archive",
                kindXZ: "XZ archive",
                kindZIP: "ZIP archive",
                kindRAR: "RAR archive",
                kindJAR: "Java JAR file",
                kindTTF: "True Type font",
                kindOTF: "Open Type font",
                kindRPM: "RPM package",
                kindText: "Text document",
                kindTextPlain: "Plain text",
                kindPHP: "PHP source",
                kindCSS: "Cascading style sheet",
                kindHTML: "HTML document",
                kindJS: "Javascript source",
                kindRTF: "Rich Text Format",
                kindC: "C source",
                kindCHeader: "C header source",
                kindCPP: "C++ source",
                kindCPPHeader: "C++ header source",
                kindShell: "Unix shell script",
                kindPython: "Python source",
                kindJava: "Java source",
                kindRuby: "Ruby source",
                kindPerl: "Perl script",
                kindSQL: "SQL source",
                kindXML: "XML document",
                kindAWK: "AWK source",
                kindCSV: "Comma separated values",
                kindDOCBOOK: "Docbook XML document",
                kindMarkdown: "Markdown text",
                kindImage: "Image",
                kindBMP: "BMP image",
                kindJPEG: "JPEG image",
                kindGIF: "GIF Image",
                kindPNG: "PNG Image",
                kindTIFF: "TIFF image",
                kindTGA: "TGA image",
                kindPSD: "Adobe Photoshop image",
                kindXBITMAP: "X bitmap image",
                kindPXM: "Pixelmator image",
                kindAudio: "Audio media",
                kindAudioMPEG: "MPEG audio",
                kindAudioMPEG4: "MPEG-4 audio",
                kindAudioMIDI: "MIDI audio",
                kindAudioOGG: "Ogg Vorbis audio",
                kindAudioWAV: "WAV audio",
                AudioPlaylist: "MP3 playlist",
                kindVideo: "Video media",
                kindVideoDV: "DV movie",
                kindVideoMPEG: "MPEG movie",
                kindVideoMPEG4: "MPEG-4 movie",
                kindVideoAVI: "AVI movie",
                kindVideoMOV: "Quick Time movie",
                kindVideoWM: "Windows Media movie",
                kindVideoFlash: "Flash movie",
                kindVideoMKV: "Matroska movie",
                kindVideoOGG: "Ogg movie"
            }
        }), st.fn.elfinderbutton = function (f) {
            return this.each(function () {
                function e() {
                    a.toHide(n)
                }
                var n, t, i = "class",
                    a = f.fm,
                    o = a.res(i, "disabled"),
                    r = a.res(i, "active"),
                    s = a.res(i, "hover"),
                    l = "elfinder-button-menu-item",
                    c = st('<span class="elfinder-button-text">' + f.title + "</span>"),
                    d = f.className || f.name,
                    p = st(this).addClass("ui-state-default elfinder-button").attr("title", f.title).append('<span class="elfinder-button-icon elfinder-button-icon-' + d + '"></span>', c).on("mouseenter mouseleave", function (e) {
                        p.hasClass(o) || p["mouseleave" == e.type ? "removeClass" : "addClass"](s)
                    }).on("click", function (e) {
                        p.hasClass(o) || (n && 1 <= f.variants.length ? (n.is(":hidden") && a.getUI().click(), e.stopPropagation(), n.css(u()).slideToggle({
                            duration: 100,
                            done: function (e) {
                                a[n.is(":visible") ? "toFront" : "toHide"](n)
                            }
                        })) : a.exec(f.name, h(), {
                            _userAction: !0,
                            _currentType: "toolbar",
                            _currentNode: p
                        }))
                    }),
                    u = function () {
                        var e = a.getUI(),
                            t = e.offset(),
                            n = p.offset();
                        return {
                            top: n.top - t.top,
                            left: n.left - t.left,
                            maxHeight: e.height() - 40
                        }
                    },
                    h = function () {
                        var e = a.selected();
                        return e = e.length ? e : a.cwd() ? [a.cwd().hash] : void 0
                    };
                c.hide(), f.button = p, Array.isArray(f.variants) && (p.addClass("elfinder-menubutton"), n = st('<div class="ui-front ui-widget ui-widget-content elfinder-button-menu elfinder-button-' + d + '-menu ui-corner-all"></div>').hide().appendTo(a.getUI()).on("mouseenter mouseleave", "." + l, function () {
                    st(this).toggleClass(s)
                }).on("click", "." + l, function (e) {
                    var t = st(this).data("value");
                    e.preventDefault(), e.stopPropagation(), p.removeClass(s), a.toHide(n), "object" == typeof (t = void 0 === t ? {} : t) && (t._userAction = !0), a.exec(f.name, h(), t)
                }).on("close", e), a.bind("disable select", e).getUI().on("click", e), f.change(function () {
                    n.html(""), st.each(f.variants, function (e, t) {
                        n.append(st('<div class="' + l + '">' + t[1] + "</div>").data("value", t[0]).addClass(t[0] == f.value ? "elfinder-button-menu-item-selected" : ""))
                    })
                })), f.change(function () {
                    var e;
                    t && cancelAnimationFrame(t), t = requestAnimationFrame(function () {
                        f.disabled() ? p.removeClass(r + " " + s).addClass(o) : (p.removeClass(o), p[f.active() ? "addClass" : "removeClass"](r)), f.syncTitleOnChange && (e = f.className || f.name, d !== e && (p.children(".elfinder-button-icon").removeClass("elfinder-button-icon-" + d).addClass("elfinder-button-icon-" + e), n && n.removeClass("elfinder-button-" + d + "-menu").addClass("elfinder-button-" + e + "-menu"), d = e), c.html(f.title), p.attr("title", f.title))
                    })
                }).change()
            })
        }, st.fn.elfindercontextmenu = function (E) {
            return this.each(function () {
                st(this);
                var m, a, g, p, u, h, f, v = "elfinder-contextmenu-item",
                    b = "elfinder-contextsubmenu-item",
                    y = "elfinder-contextmenu-extra-icon",
                    w = E.res("class", "hover"),
                    t = {
                        distance: 8,
                        start: function () {
                            x.data("drag", !0).data("touching") && x.find("." + w).removeClass(w)
                        },
                        stop: function () {
                            x.data("draged", !0).removeData("drag")
                        }
                    },
                    x = st(this).addClass("touch-punch ui-helper-reset ui-front ui-widget ui-state-default ui-corner-all elfinder-contextmenu elfinder-contextmenu-" + E.direction).hide().on("touchstart", function (e) {
                        x.data("touching", !0).children().removeClass(w)
                    }).on("touchend", function (e) {
                        x.removeData("touching")
                    }).on("mouseenter mouseleave", "." + v, function (e) {
                        st(this).toggleClass(w, !("mouseenter" !== e.type && (x.data("draged") || !x.data("submenuKeep")))), x.data("draged") && x.data("submenuKeep") && x.find(".elfinder-contextmenu-sub:visible").parent().addClass(w)
                    }).on("mouseenter mouseleave", "." + y, function (e) {
                        st(this).parent().toggleClass(w, "mouseleave" === e.type)
                    }).on("mouseenter mouseleave", "." + v + ",." + b, function (e) {
                        function t(n, i) {
                            st.each(i ? u : g, function (e, t) {
                                if (n[0] === t) return (i ? u : g)._cur = e, i ? h = n : p = n, !1
                            })
                        }
                        var n, i, a;
                        e.originalEvent && (n = st(this), i = function () {
                            p && !p.children("div.elfinder-contextmenu-sub:visible").length && p.removeClass(w)
                        }, "mouseenter" === e.type ? n.hasClass(b) ? (h && h.removeClass(w), p && (u = p.find("div." + b)), t(n, !0)) : (i(), t(n)) : n.hasClass(b) ? u = h = null : (i(), a = p, setTimeout(function () {
                            a === p && (p = null)
                        }, 250)))
                    }).on("contextmenu", function () {
                        return !1
                    }).on("mouseup", function () {
                        setTimeout(function () {
                            x.removeData("draged")
                        }, 100)
                    }).draggable(t),
                    k = "ltr" === E.direction,
                    C = k ? "left" : "right",
                    o = Object.assign({}, E.options.contextmenu),
                    l = '<div class="' + v + '{className}"><span class="elfinder-button-icon {icon} elfinder-contextmenu-icon"{style}></span><span>{label}</span></div>',
                    z = function (e, t, n, i) {
                        var a, o = "",
                            r = "",
                            s = "";
                        return i && (i.className && (o = " " + i.className), i.iconClass && (s = i.iconClass, t = ""), i.iconImg && (a = (i = i.iconImg.split(/ +/))[1] && i[2] ? E.escape(i[1] + "px " + i[2] + "px") : "", r = " style=\"background:url('" + E.escape(i[0]) + "') " + (a || "0 0") + " no-repeat;" + (a ? "" : "posbackground-size:contain;") + '"')), st(l.replace("{icon}", t ? "elfinder-button-icon-" + t : s || "").replace("{label}", e).replace("{style}", r).replace("{className}", o)).on("click", function (e) {
                            e.stopPropagation(), e.preventDefault(), n()
                        })
                    },
                    T = function (e) {
                        var e = e.split(/ +/),
                            t = e[1] && e[2] ? e[1] + "px " + e[2] + "px" : "";
                        return {
                            backgroundImage: 'url("' + e[0] + '")',
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: t || "",
                            backgroundSize: t ? "" : "contain"
                        }
                    },
                    A = function () {
                        var n = "touchstart.contextmenuAutoToggle";
                        x.data("hideTm") && clearTimeout(x.data("hideTm")), x.is(":visible") && x.on("touchstart", function (e) {
                            1 < e.originalEvent.touches.length || (x.stop(), E.toFront(x), x.data("hideTm") && clearTimeout(x.data("hideTm")))
                        }).data("hideTm", setTimeout(function () {
                            x.is(":visible") && (a.find(".elfinder-cwd-file").off(n), a.find(".elfinder-cwd-file.ui-selected").one(n, function (e) {
                                var t;
                                if (!(1 < e.originalEvent.touches.length)) return t = st(e.target), !x.first().length || t.is("input:checkbox") || t.hasClass("elfinder-cwd-select") ? void a.find(".elfinder-cwd-file").off(n) : (e.stopPropagation(), S(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY), a.data("longtap", !0), void t.one("touchend", function () {
                                    setTimeout(function () {
                                        a.removeData("longtap")
                                    }, 80)
                                }))
                            }).one("unselect." + E.namespace, function () {
                                a.find(".elfinder-cwd-file").off(n)
                            }), x.fadeOut({
                                duration: 300,
                                fail: function () {
                                    x.css("opacity", "1").show()
                                },
                                done: function () {
                                    E.toHide(x)
                                }
                            }))
                        }, 4500))
                    },
                    j = function (e) {
                        var t = e.keyCode,
                            n = st.ui.keyCode.ESCAPE,
                            i = st.ui.keyCode.ENTER,
                            a = st.ui.keyCode.LEFT,
                            o = st.ui.keyCode.RIGHT,
                            r = st.ui.keyCode.UP,
                            s = st.ui.keyCode.DOWN,
                            l = "ltr" === E.direction ? o : a,
                            c = l === o ? a : o; - 1 !== st.inArray(t, [n, i, a, o, r, s]) && (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), t == n || t === c ? p && u && h ? (h.trigger("mouseleave").trigger("submenuclose"), p.addClass(w), h = u = null) : t == n && O() : t == r || t == s ? u ? (h && h.trigger("mouseleave"), t == s && (!h || u.length <= ++u._cur) ? u._cur = 0 : t == r && (!h || --u._cur < 0) && (u._cur = u.length - 1), h = u.eq(u._cur).trigger("mouseenter")) : (u = null, p && p.trigger("mouseleave"), t == s && (!p || g.length <= ++g._cur) ? g._cur = 0 : t == r && (!p || --g._cur < 0) && (g._cur = g.length - 1), p = g.eq(g._cur).addClass(w)) : !p || t != i && t !== l || (p.hasClass("elfinder-contextmenu-group") ? h ? t == i && h.click() : (p.trigger("mouseenter"), (u = p.find("div." + b))._cur = 0, h = u.first().addClass(w)) : t == i && p.click()))
                    },
                    S = function (e, t, n) {
                        var i = x.outerWidth(),
                            a = x.outerHeight(),
                            o = m.attr("style"),
                            r = m.offset(),
                            s = m.width(),
                            l = m.height(),
                            c = E.UA.Mobile ? 40 : 2,
                            d = E.UA.Mobile ? 20 : 2,
                            e = e - (r ? r.left : 0),
                            t = t - (r ? r.top : 0),
                            n = Object.assign(n || {}, {
                                top: Math.max(0, t + d + a < l ? t + d : t - (t + a - l)),
                                left: Math.max(0, e < i + c || e + c + i < s ? e + c : e - c - i),
                                opacity: "1"
                            });
                        f = !0, E.autoSync("stop"), m.width(s), x.stop().removeAttr("style").css(n), E.toFront(x), x.show(), m.attr("style", o), n[C] = parseInt(x.width()), x.find(".elfinder-contextmenu-sub").css(n), E.UA.iOS && st("div.elfinder div.overflow-scrolling-touch").css("-webkit-overflow-scrolling", "auto"), h = u = p = null, st(document).on("keydown." + E.namespace, j), (r = st._data(document).events) && r.keydown && r.keydown.unshift(r.keydown.pop()), E.UA.Mobile && A(), requestAnimationFrame(function () {
                            E.getUI().one("click." + E.namespace, O)
                        })
                    },
                    O = function () {
                        if (E.getUI().off("click." + E.namespace, O), st(document).off("keydown." + E.namespace, j), I = M = null, x.is(":visible") || x.children().length) {
                            E.toHide(x.removeAttr("style").empty().removeData("submenuKeep"));
                            try {
                                x.draggable("instance") || x.draggable(t)
                            } catch (e) {
                                x.hasClass("ui-draggable") || x.draggable(t)
                            }
                            x.data("prevNode") && (x.data("prevNode").after(x), x.removeData("prevNode")), E.trigger("closecontextmenu"), E.UA.iOS && st("div.elfinder div.overflow-scrolling-touch").css("-webkit-overflow-scrolling", "touch")
                        }
                        f && E.searchStatus.state < 1 && !E.searchStatus.ininc && E.autoSync(), f = !1
                    },
                    I = null,
                    M = null;
                E.one("load", function () {
                    m = E.getUI(), a = E.getUI("cwd"), E.bind("contextmenu", function (e) {
                        var t, r, s, n, l, c, d, h, f, e = e.data,
                            i = {};
                        e.type && "files" !== e.type && a.trigger("unselectall"), O(), e.type && e.targets ? (E.trigger("contextmenucreate", e), r = e.type, s = e.targets, d = c = !1, h = [], f = "cwd" === r, I = r, M = s, (l = E.option("uiCmdMap", f ? void 0 : s[0])) || (l = {}), f || (h = E.getDisabledCmds(s)), 1 < (n = E.selected().length) && x.append('<div class="ui-corner-top ui-widget-header elfinder-contextmenu-header"><span>' + E.i18n("selectedItems", "" + n) + "</span></div>"), g = st(), st.each(o[r] || [], function (e, t) {
                            var n, i, a, p, u, o;
                            if ("|" === t) c && (d = !0);
                            else {
                                if (l[t] ? (i = l[t], a = !0) : i = t, !(n = E.getCommand(i)) || f || E.searchStatus.state && n.disableOnSearch || (n.__disabled = n._disabled, n._disabled = !(n.alwaysEnabled || E._commands[i] && !(-1 !== st.inArray(t, h) || a && h[i])), st.each(n.linkedCmds, function (e, t) {
                                    var n;
                                    (n = E.getCommand(t)) && (n.__disabled = n._disabled, n._disabled = !(n.alwaysEnabled || E._commands[t] && !h[t]))
                                })), n && !n._disabled && -1 != n.getstate(s)) {
                                    if (n.variants) {
                                        if (!n.variants.length) return;
                                        p = z(n.title, n.className || n.name, function () { }, n.contextmenuOpts), u = st('<div class="ui-front ui-corner-all elfinder-contextmenu-sub"></div>').hide().css("max-height", E.getUI().height() - 30).appendTo(p.append('<span class="elfinder-contextmenu-arrow"></span>')), o = function (e) {
                                            var t, n, i, a, o, r, s, l, c, d;
                                            e ? (e = m.attr("style"), m.width(m.width()), u.css({
                                                top: "-1000px",
                                                left: "auto",
                                                right: "auto"
                                            }), c = (t = p.offset()).left, t = t.top, n = p.outerWidth(), i = u.outerWidth(!0), a = u.outerHeight(!0), o = (r = m.offset()).left + m.width(), r = r.top + m.height(), l = n, (s = k) ? 10 < (d = c + n + i - o) && (i - 5 < c ? (l -= 5, s = !1) : E.UA.Mobile || (l = n - d)) : 0 < (d = i - c) && (c + n + i - 15 < o ? (l -= 5, s = !0) : E.UA.Mobile || (l = n - d)), c = 0 < (d = t + 5 + a - r) && t < r ? 5 - d : 0 < d ? 30 - a : 5, x.find(".elfinder-contextmenu-sub:visible").hide(), u.css({
                                                top: c,
                                                left: s ? l : "auto",
                                                right: s ? "auto" : l,
                                                overflowY: "auto"
                                            }).show(), m.attr("style", e)) : u.hide()
                                        }, p.addClass("elfinder-contextmenu-group").on("mouseleave", ".elfinder-contextmenu-sub", function (e) {
                                            x.data("draged") || x.removeData("submenuKeep")
                                        }).on("submenuclose", ".elfinder-contextmenu-sub", function (e) {
                                            o(!1)
                                        }).on("click", "." + b, function (e) {
                                            var t;
                                            e.stopPropagation(), x.data("draged") || (e = st(this), n.keepContextmenu ? (e.removeClass(w), p.addClass(w)) : x.hide(), "object" == typeof (t = void 0 === (t = e.data("exec")) ? {} : t) && (t._userAction = !0, t._currentType = r, t._currentNode = e), n.keepContextmenu || O(), E.exec(n.name, s, t))
                                        }).on("touchend", function (e) {
                                            x.data("drag") || (o(!0), x.data("submenuKeep", !0))
                                        }).on("mouseenter mouseleave", function (e) {
                                            x.data("touching") || (p.data("timer") && (clearTimeout(p.data("timer")), p.removeData("timer")), st(e.target).closest(".elfinder-contextmenu-sub", x).length || ("mouseleave" === e.type ? x.data("submenuKeep") || p.data("timer", setTimeout(function () {
                                                p.removeData("timer"), o(!1)
                                            }, 250)) : p.data("timer", setTimeout(function () {
                                                p.removeData("timer"), o(!0)
                                            }, g.find("div.elfinder-contextmenu-sub:visible").length ? 250 : 0))))
                                        }), st.each(n.variants, function (e, t) {
                                            var n, i = "|" === t ? '<div class="elfinder-contextmenu-separator"></div>' : st('<div class="' + v + " " + b + '"><span>' + t[1] + "</span></div>").data("exec", t[0]);
                                            void 0 !== t[2] && (n = st("<span></span>").addClass("elfinder-button-icon elfinder-contextmenu-icon"), /\//.test(t[2]) ? n.css(T(t[2])) : n.addClass("elfinder-button-icon-" + t[2]), i.prepend(n).addClass(b + "-icon")), u.append(i)
                                        })
                                    } else p = z(n.title, n.className || n.name, function () {
                                        x.data("draged") || (n.keepContextmenu || O(), E.exec(n.name, s, {
                                            _userAction: !0,
                                            _currentType: r,
                                            _currentNode: p
                                        }))
                                    }, n.contextmenuOpts), n.extra && n.extra.node ? (st('<span class="elfinder-button-icon elfinder-button-icon-' + (n.extra.icon || "") + " " + y + '"></span>').append(n.extra.node).appendTo(p), st(n.extra.node).trigger("ready", {
                                        targets: s
                                    })) : p.remove("." + y);
                                    n.extendsCmd && p.children("span.elfinder-button-icon").addClass("elfinder-button-icon-" + n.extendsCmd), d && x.append('<div class="elfinder-contextmenu-separator"></div>'), x.append(p), d = !(c = !0)
                                }
                                n && void 0 !== n.__disabled && (n._disabled = n.__disabled, delete n.__disabled, st.each(n.linkedCmds, function (e, t) {
                                    (t = E.getCommand(t)) && (t._disabled = t.__disabled, delete t.__disabled)
                                }))
                            }
                        }), g = x.children("div." + v), E.trigger("contextmenucreatedone", e)) : e.raw && (n = e.raw, I = "raw", st.each(n, function (e, t) {
                            var n;
                            "|" === t ? x.append('<div class="elfinder-contextmenu-separator"></div>') : t.label && "function" == typeof t.callback && (n = z(t.label, t.icon, function () {
                                x.data("draged") || (t.remain || O(), t.callback())
                            }, t.options || null), x.append(n))
                        }), g = x.children("div." + v)), x.children().length && ((t = e.prevNode || null) && (x.data("prevNode", x.prev()), t.after(x)), e.fitHeight && (i = {
                            maxHeight: Math.min(E.getUI().height(), st(window).height()),
                            overflowY: "auto"
                        }, x.draggable("destroy").removeClass("ui-draggable")), S(e.x, e.y, i), e.opened && "function" == typeof e.opened && e.opened.call(x))
                    }).one("destroy", function () {
                        x.remove()
                    }).bind("disable", O).bind("select", function (e) {
                        "files" !== I || e.data && e.data.selected.toString() === M.toString() || O()
                    })
                }).shortcut({
                    pattern: "mac" === E.OS ? "ctrl+m" : "contextmenu shift+f10",
                    description: "contextmenu",
                    callback: function (e) {
                        e.stopPropagation(), e.preventDefault(), st(document).one("contextmenu." + E.namespace, function (e) {
                            e.preventDefault(), e.stopPropagation()
                        });
                        var t, n, i, a, e = E.selected();
                        e.length ? (t = "files", a = E.cwdHash2Elm((n = e)[0])) : (t = "cwd", n = [E.cwd().hash], i = E.getUI("workzone").offset()), (i = (a = a && a.length ? a : E.getUI("workzone")).offset()).top += a.height() / 2, i.left += a.width() / 2, E.trigger("contextmenu", {
                            type: t,
                            targets: n,
                            x: i.left,
                            y: i.top
                        })
                    }
                })
            })
        }, st.fn.elfindercwd = function (We, Be) {
            return this.not(".elfinder-cwd").each(function () {
                function H(e) {
                    We.cwdHash2Elm(e).trigger(p)
                }

                function _(e, t) {
                    var n, i, a, o, r, s = v ? F.find("tbody") : F,
                        l = e.length,
                        c = {},
                        d = !!st.htmlPrefilter,
                        p = st(d ? document.createDocumentFragment() : "<div></div>");
                    if (ke < l) D(), z = We.arrayFlip(st.map(e, function (e) {
                        return e.hash
                    }), !0), A();
                    else {
                        for (l && R.removeClass("elfinder-cwd-wrapper-empty"), r = "self" === We.option("tmbUrl"); l--;) i = (n = e[l]).hash, We.cwdHash2Elm(i).length || (!(a = (a = function (e) {
                            for (var t, n = F.find("[id]:first"); n.length;) {
                                if (t = We.file(We.cwdId2Hash(n.attr("id"))), !n.hasClass("elfinder-cwd-parent") && t && We.compare(e, t) < 0) return n;
                                n = n.next("[id]")
                            }
                        }(n)) && !a.length ? null : a) && 0 <= (o = function (e) {
                            for (var t = j.length, n = 0; n < t; n++)
                                if (We.compare(e, j[n]) < 0) return n;
                            return t || -1
                        }(n)) ? j.splice(o, 0, n) : (p.empty().append(ce(n)), "directory" !== n.mime || u || je(p), o = d ? p : p.children(), a ? a.before(o) : s.append(o), ++S.renderd), We.cwdHash2Elm(i).length && (n.tmb && (1 != n.tmb || 0 < n.size) || r && 0 === n.mime.indexOf("image/")) && (c[i] = n.tmb || "self"));
                        v && (Te(), E({
                            fitWidth: !C
                        })), Ee(s), Object.keys(c).length && (Object.assign(S.attachTmbs, c), j.length < 1 && Oe())
                    }
                }

                function N(e) {
                    var t, n, i, a, o = e.length,
                        r = 1 < We.searchStatus.state,
                        s = We.getCommand(We.currentReqCmd) || {};
                    if (!We.cwd().hash && !s.noChangeDirOnRemovedCwd) return st.each(Q.reverse(), function (e, t) {
                        if (We.file(t)) return a = !0, We.one(We.currentReqCmd + "done", function () {
                            We.cwd().hash || We.exec("open", t)
                        }), !1
                    }), a || We.cwd().hash || We.exec("open", We.roots[Object.keys(We.roots)[0]]);
                    for (; o--;) {
                        if (t = e[o], (n = We.cwdHash2Elm(t)).length) try {
                            n.remove(), --S.renderd
                        } catch (e) {
                            We.debug("error", e)
                        } else - 1 !== (i = ge(t)) && j.splice(i, 1);
                        z[t] && delete z[t], r && -1 !== (i = st.inArray(t, d)) && d.splice(i, 1)
                    }
                    r && We.trigger("cwdhasheschange", d), v && (Te(), E({
                        fitWidth: !C
                    }))
                }
                var L, W, i, B, n, a, e, u = We.UA.Mobile,
                    v = "list" == We.viewType,
                    p = "select." + We.namespace,
                    h = "unselect." + We.namespace,
                    $ = "disable." + We.namespace,
                    V = "enable." + We.namespace,
                    l = "class",
                    b = We.res(l, "cwdfile"),
                    y = "." + b,
                    f = "ui-selected",
                    m = We.res(l, "disabled"),
                    K = We.res(l, "draggable"),
                    X = We.res(l, "droppable"),
                    o = We.res(l, "hover"),
                    t = We.res(l, "active"),
                    c = We.res(l, "adroppable"),
                    J = b + "-tmp",
                    s = "elfinder-cwd-selectchk",
                    G = 0 < We.options.loadTmbs ? We.options.loadTmbs : 5,
                    g = "",
                    Y = {},
                    Q = [],
                    d = [],
                    r = void 0,
                    w = [],
                    x = "",
                    Z = function () {
                        for (var e = "", t = 0; t < w.length; t++) e += '<td class="elfinder-col-' + w[t] + '">{' + w[t] + "}</td>";
                        return e
                    },
                    ee = function () {
                        return '<tr id="{id}" class="' + b + ' {permsclass} {dirclass}" title="{tooltip}"{css}><td class="elfinder-col-name"><div class="elfinder-cwd-file-wrapper"><span class="elfinder-cwd-icon {mime}"{style}></span>{marker}<span class="elfinder-cwd-filename">{name}</span></div>' + k + "</td>" + Z() + "</tr>"
                    },
                    k = st.map(Be.showSelectCheckboxUA, function (e) {
                        return !(!We.UA[e] && !e.match(/^all$/i)) || null
                    }).length ? '<div class="elfinder-cwd-select"><input type="checkbox" class="' + s + '"></div>' : "",
                    te = !1,
                    C = null,
                    ne = {
                        icon: '<div id="{id}" class="' + b + ' {permsclass} {dirclass} ui-corner-all" title="{tooltip}"><div class="elfinder-cwd-file-wrapper ui-corner-all"><div class="elfinder-cwd-icon {mime} ui-corner-all" unselectable="on"{style}></div>{marker}</div><div class="elfinder-cwd-filename" title="{nametitle}">{name}</div>' + k + "</div>",
                        row: ""
                    },
                    ie = We.res("tpl", "perms"),
                    ae = We.res("tpl", "lock"),
                    oe = We.res("tpl", "symlink"),
                    re = {
                        id: function (e) {
                            return We.cwdHash2Id(e.hash)
                        },
                        name: function (e) {
                            e = We.escape(e.i18 || e.name);
                            return e = v ? e : e.replace(/([_.])/g, "&#8203;$1")
                        },
                        nametitle: function (e) {
                            return We.escape(e.i18 || e.name)
                        },
                        permsclass: function (e) {
                            return We.perms2class(e)
                        },
                        perm: function (e) {
                            return We.formatPermissions(e)
                        },
                        dirclass: function (e) {
                            var t = "directory" == e.mime ? "directory" : "";
                            return e.isroot && (t += " isroot"), e.csscls && (t += " " + We.escape(e.csscls)), Be.getClass && (t += " " + Be.getClass(e)), t
                        },
                        style: function (e) {
                            return e.icon ? We.getIconStyle(e) : ""
                        },
                        mime: function (e) {
                            var t = We.mime2class(e.mime);
                            return e.icon && (t += " elfinder-cwd-bgurl"), t
                        },
                        size: function (e) {
                            return "directory" !== e.mime || e.size ? We.formatSize(e.size) : "-"
                        },
                        date: function (e) {
                            return We.formatDate(e)
                        },
                        kind: function (e) {
                            return We.mime2kind(e)
                        },
                        mode: function (e) {
                            return e.perm ? We.formatFileMode(e.perm) : ""
                        },
                        modestr: function (e) {
                            return e.perm ? We.formatFileMode(e.perm, "string") : ""
                        },
                        modeoct: function (e) {
                            return e.perm ? We.formatFileMode(e.perm, "octal") : ""
                        },
                        modeboth: function (e) {
                            return e.perm ? We.formatFileMode(e.perm, "both") : ""
                        },
                        marker: function (e) {
                            return (e.alias || "symlink-broken" == e.mime ? oe : "") + (e.read && e.write ? "" : ie) + (e.locked ? ae : "")
                        },
                        tooltip: function (e) {
                            var t = We.formatDate(e) + (0 < e.size ? " (" + We.formatSize(e.size) + ")" : ""),
                                n = "",
                                n = g && e.path ? We.escape(e.path.replace(/\/[^\/]*$/, "")) : e.tooltip ? We.escape(e.tooltip).replace(/\r/g, "&#13;") : "";
                            return v && (n += (n ? "&#13;" : "") + We.escape(e.i18 || e.name)), n ? n + "&#13;" + t : t
                        }
                    },
                    se = {},
                    le = function (e, t) {
                        var n, i;
                        if (e && !se[e] && (void 0 === W && (st("#elfinderAddBadgeStyle" + We.namespace).length && st("#elfinderAddBadgeStyle" + We.namespace).remove(), W = st('<style id="addBadgeStyle' + We.namespace + '"></style>').insertBefore(st("head").children(":first")).get(0).sheet || null), W)) {
                            if (i = (e = e.toLowerCase()).split("/"), t = We.escape(We.mimeTypes[e] || (t.replace(/.bac?k$/i, "").match(/\.([^.]+)$/) || ["", ""])[1])) {
                                n = ".elfinder-cwd-icon-" + i[0].replace(/(\.|\+)/g, "-"), void 0 !== i[1] && (n += ".elfinder-cwd-icon-" + i[1].replace(/(\.|\+)/g, "-"));
                                try {
                                    W.insertRule(n + ':before{content:"' + t.toLowerCase() + '"}', 0)
                                } catch (e) { }
                            }
                            se[e] = !0
                        }
                    },
                    ce = function (n) {
                        return n.mime && "directory" !== n.mime && !se[n.mime] && le(n.mime, n.name), ne[v ? "row" : "icon"].replace(/\{([a-z0-9_]+)\}/g, function (e, t) {
                            return re[t] ? re[t](n, We) : n[t] || ""
                        })
                    },
                    de = st(),
                    pe = !1,
                    z = {},
                    ue = !1,
                    he = function () {
                        We.cwd().hash;
                        k && P.find("input").prop("checked", !0), We.lazy(function () {
                            var e;
                            We.maxTargets && (r || d).length > We.maxTargets ? (T({
                                notrigger: !0
                            }), e = (e = st.map(r || d, function (e) {
                                return We.file(e) || null
                            })).slice(0, We.maxTargets), z = {}, st.each(e, function (e, t) {
                                z[t.hash] = !0, We.cwdHash2Elm(t.hash).trigger(p)
                            }), We.toast({
                                mode: "warning",
                                msg: We.i18n(["errMaxTargets", We.maxTargets])
                            })) : (F.find("[id]:not(." + f + "):not(.elfinder-cwd-parent)").trigger(p), z = We.arrayFlip(r || d, !0)), A(), k && P.data("pending", !1)
                        }, 0, {
                            repaint: !0
                        })
                    },
                    T = function (e) {
                        e = e || {};
                        k && P.find("input").prop("checked", !1), Object.keys(z).length && (pe = !1, z = {}, F.find("[id]." + f).trigger(h), k && F.find("input:checkbox." + s).prop("checked", !1)), e.notrigger || A(), k && P.data("pending", !1), F.removeClass("elfinder-cwd-allselected")
                    },
                    fe = void 0,
                    A = function () {
                        var e = Object.keys(z),
                            t = {
                                selected: e,
                                origin: "cwd"
                            };
                        I && (1 < e.length || e[0] !== We.cwdId2Hash(I.attr("id"))) && I.hasClass(f) && I.trigger(h), ue = e.length && e.length === (r || d).length && (!We.maxTargets || e.length <= We.maxTargets), k && (P.find("input").prop("checked", ue), F[ue ? "addClass" : "removeClass"]("elfinder-cwd-allselected")), ue ? t.selectall = !0 : e.length || (t.unselectall = !0), We.trigger("select", t)
                    },
                    me = function (e, t) {
                        var n, i, a, o, r;
                        e.length && (n = e.position().top, i = e.outerHeight(!0), (a = U.scrollTop()) + (o = U.get(0).clientHeight) < n + (r = M ? M.outerHeight(!0) : 0) + i ? U.scrollTop(parseInt(n + r + i - o)) : n < a && U.scrollTop(n), v && U.scrollLeft(0), t && We.resources.blink(e, "lookme"))
                    },
                    j = [],
                    S = {},
                    ge = function (e) {
                        for (var t = j.length; t--;)
                            if (j[t].hash == e) return t;
                        return -1
                    },
                    O = "elfscrstop",
                    ve = !1,
                    be = {
                        disabled: !0,
                        filter: "[id]:first",
                        stop: A,
                        delay: 250,
                        appendTo: "body",
                        autoRefresh: !1,
                        selected: function (e, t) {
                            st(t.selected).trigger(p)
                        },
                        unselected: function (e, t) {
                            st(t.unselected).trigger(h)
                        }
                    },
                    ye = {},
                    we = function (e, t) {
                        if (S.renderd) {
                            var n = (v ? F.find("tbody:first") : F).children("[id]" + (Be.oldSchool ? ":not(.elfinder-cwd-parent)" : "") + ":first");
                            if (n.length) {
                                function i() {
                                    for (var e, t, n = 0; n < 5 && ((e = u.attr("id")) && (S.getTmbs = [], t = We.cwdId2Hash(e), ye[t] = e, S.attachTmbs[t] && (f[t] = S.attachTmbs[t]), d && (h[e] = !0)), (u = u.next()).length); n++);
                                }

                                function a() {
                                    var e;
                                    F.data("selectable") && (Object.assign(h, z), (e = Object.keys(h)).length && (be.filter = "#" + e.join(", #"), F.selectable("enable").selectable("option", {
                                        filter: be.filter
                                    }).selectable("refresh"))), Object.keys(f).length && (S.getTmbs = [], Se(f))
                                }

                                function o() {
                                    u.hasClass(b) || (u = u.closest(y))
                                }
                                var r, s, l, c, d = F.data("selectable"),
                                    p = (p = U.offset(), s = U.width(), l = st(window), c = n.width() / 2, c = Math.min(p.left - l.scrollLeft() + ("ltr" === We.direction ? c : s - c), p.left + s - 10), s = p.top - l.scrollTop() + 10 + (v ? L : 0), {
                                        left: Math.max(0, Math.round(c)),
                                        top: Math.max(0, Math.round(s))
                                    }),
                                    u = e ? n : st(document.elementFromPoint(p.left, p.top)),
                                    h = {},
                                    f = {},
                                    m = Math.ceil((S.hpi ? Math.ceil(R.data("rectangle").height / S.hpi * 1.5) : ke) / 5);
                                if (ye = {}, d && F.selectable("option", "disabled"), u.length && (u.hasClass(b) || u.closest(y).length || ((r = We.getUI().find(".ui-dialog:visible,.ui-widget:visible")).length ? (r.hide(), u = st(document.elementFromPoint(p.left, p.top)), r.show()) : r = null), o(), u.length || (r && r.hide(), u = st(document.elementFromPoint(p.left, p.top + 5)), r && r.show(), o())), u.length) {
                                    if (u.attr("id"))
                                        if (e) {
                                            for (var g = 0; g < m && (i(), u.length); g++);
                                            a()
                                        } else S.repaintJob && "pending" === S.repaintJob.state() && S.repaintJob.reject(), l = new Array(m), S.repaintJob = We.asyncJob(function () {
                                            i(), u.length || (a(), S.repaintJob && "pending" === S.repaintJob.state() && S.repaintJob.reject())
                                        }, l).done(a)
                                } else e && S.renderd && (t = t || 0) < 10 && requestAnimationFrame(function () {
                                    we(e, ++t)
                                })
                            }
                        }
                    },
                    I = null,
                    xe = function (e) {
                        function t(e) {
                            e && (I = st(ce(st.extend(!0, {}, e, {
                                name: "..",
                                i18: "..",
                                mime: "directory"
                            }))).addClass("elfinder-cwd-parent").on("dblclick", function () {
                                We.trigger("select", {
                                    selected: [n]
                                }).exec("open", n)
                            }), (v ? I.children("td:first") : I).children(".elfinder-cwd-select").remove(), We.cwdHash2Elm(n).length ? We.cwdHash2Elm(n).replaceWith(I) : (v ? F.find("tbody") : F).prepend(I), We.draggingUiHelper && We.draggingUiHelper.data("refreshPositions", 1))
                        }
                        var n = We.cwd().phash,
                            i = We.file(n) || null;
                        i ? t(i) : (t({
                            hash: n,
                            read: !0,
                            write: !0
                        }), We.getUI("tree").length ? We.one("parents", function () {
                            t(We.file(n) || null), U.trigger(O)
                        }) : We.request({
                            data: {
                                cmd: "parents",
                                target: We.cwd().hash
                            },
                            preventFail: !0
                        }).done(function (e) {
                            t(We.file(n) || null), U.trigger(O)
                        }))
                    },
                    ke = We.options.showFiles,
                    Ce = function () {
                        var l, e, t, c, d, n;
                        S.rendering || S.renderd && !j.length || (l = v ? F.children("table").children("tbody") : F, c = !!st.htmlPrefilter, d = st(c ? document.createDocumentFragment() : "<div></div>"), n = function (e) {
                            var t, n, e = e || null,
                                i = [],
                                a = !1,
                                o = {},
                                r = "self" === We.option("tmbUrl"),
                                s = !S.renderd,
                                e = j.splice(0, ke + (e || 0) / (S.hpi || 1));
                            S.renderd += e.length, j.length || (qe.hide(), U.off(O, Ce)), t = [], i = st.map(e, function (e) {
                                return e.hash && e.name ? ("directory" == e.mime && (a = !0), (e.tmb && (1 != e.tmb || 0 < e.size) || r && 0 === e.mime.indexOf("image/")) && (o[e.hash] = e.tmb || "self"), Y[e.hash] && t.push(e.hash), ce(e)) : null
                            }), d.empty().append(i.join("")), a && !u && je(d), n = [], Object.keys(z).length && d.find("[id]:not(." + f + "):not(.elfinder-cwd-parent)").each(function () {
                                z[We.cwdId2Hash(this.id)] && n.push(st(this))
                            }), l.append(c ? d : d.children()), n.length && (st.each(n, function (e, t) {
                                t.trigger(p)
                            }), A()), t.length && We.trigger("lockfiles", {
                                files: t
                            }), S.hpi || Ee(l, e.length), v && (F.find("thead").show(), E({
                                fitWidth: !C
                            })), Object.keys(o).length && Object.assign(S.attachTmbs, o), !s || u || F.data("selectable") || F.selectable(be).data("selectable", !0), ve || U.trigger(O)
                        }, S.renderd || (S.rendering = !0, U.scrollTop(0), e = We.cwd().phash, n(), Be.oldSchool && (e && !g ? xe(e) : I = st()), v && (C && Te(), E({
                            fitWidth: !0
                        })), S.itemH = (v ? l.find("tr:first") : l.find("[id]:first")).outerHeight(!0), We.trigger("cwdrender"), S.rendering = !1, we(!0)), !S.rendering && j.length ? 0 < (t = U.height() + U.scrollTop() + We.options.showThreshold + S.row - S.renderd * S.hpi) ? (S.rendering = !0, We.lazy(function () {
                            n(t), S.rendering = !1
                        })) : We.enabled() || q() : q())
                    },
                    M = null,
                    ze = We.UA.CSS.positionSticky && We.UA.CSS.widthMaxContent,
                    E = function (e) {
                        if (L = 0, Be.listView.fixedHeader) {
                            function t() {
                                var e = "ltr" === We.direction ? "left" : "right",
                                    t = -1 * ("ltr" === We.direction ? U.scrollLeft() : i.outerWidth(!0) - U.width() - U.scrollLeft());
                                n.css(e) !== t && n.css(e, t)
                            }
                            var n, i, a, o, r, s, l, c, d, p = e || {},
                                e = F.find("tbody"),
                                u = e.children("tr:first");
                            if (u.length && u.is(":visible")) {
                                if (i = e.parent(), M ? o = (a = st("#" + We.namespace + "-cwd-thead")).children("tr:first") : (d = !0, e.addClass("elfinder-cwd-fixheader"), e = (o = (a = F.find("thead").attr("id", We.namespace + "-cwd-thead")).children("tr:first")).outerHeight(!0), F.css("margin-top", e - parseInt(i.css("padding-top"))), ze ? (M = st('<div class="elfinder-table-header-sticky"></div>').addClass(F.attr("class")).append(st("<table></table>").append(a)), F.after(M), U.on("resize.fixheader", function (e) {
                                    e.stopPropagation(), E({
                                        fitWidth: !0
                                    })
                                })) : (n = st("<div></div>").addClass(F.attr("class")).append(st("<table></table>").append(a)), M = st("<div></div>").addClass(U.attr("class") + " elfinder-cwd-fixheader").removeClass("ui-droppable native-droppable").css(U.position()).css({
                                    height: e,
                                    width: F.outerWidth()
                                }).append(n), "rtl" === We.direction && M.css("left", U.data("width") - U.width() + "px"), t(), U.after(M).on("scroll.fixheader resize.fixheader", function (e) {
                                    t(), "resize" === e.type && (e.stopPropagation(), M.css(U.position()), U.data("width", U.css("overflow", "hidden").width()), U.css("overflow", "auto"), E())
                                }))), d || p.fitWidth || 2 < Math.abs(u.outerWidth() - o.outerWidth()))
                                    for (var h = w.length + 1, f = 0; f < h && (r = o.children("td:eq(" + f + ")"), s = u.children("td:eq(" + f + ")"), l = r.width(), c = s.width(), void 0 === r.data("delta") && r.data("delta", r.outerWidth() - l - (s.outerWidth() - c)), c -= r.data("delta"), d || p.fitWidth || l !== c); f++) r.css("width", c + "px");
                                ze || (M.data("widthTimer") && cancelAnimationFrame(M.data("widthTimer")), M.data("widthTimer", requestAnimationFrame(function () {
                                    M && (M.css("width", He.width() + "px"), "rtl" === We.direction && M.css("left", U.data("width") - U.width() + "px"))
                                }))), L = a.height()
                            }
                        }
                    },
                    Te = function () {
                        var e, i;
                        v && C && (e = "elfinder-cwd-colwidth", (i = F.find("tr[id]:first")).hasClass(e) || (F.find("tr." + e).removeClass(e).find("td").css("width", ""), i.addClass(e), F.find("table:first").css("table-layout", "fixed"), st.each(st.merge(["name"], w), function (e, t) {
                            var n = C[t] || i.find("td.elfinder-col-" + t).width();
                            i.find("td.elfinder-col-" + t).width(n)
                        })))
                    },
                    Ae = Object.assign({}, We.droppable, {
                        over: function (e, t) {
                            var n, i, a, o = st(this),
                                r = t.helper,
                                s = We._commands.copy && (e.shiftKey || e.ctrlKey || e.metaKey);
                            e.stopPropagation(), r.data("dropover", r.data("dropover") + 1), o.data("dropover", !0), r.removeClass("elfinder-drag-helper-move elfinder-drag-helper-plus"), r.data("namespace") === We.namespace && We.insideWorkzone(e.pageX, e.pageY) ? (o.hasClass(We.res(l, "cwdfile")) ? (n = We.cwdId2Hash(o.attr("id")), o.data("dropover", n)) : (n = We.cwd().hash, We.cwd().write && o.data("dropover", n)), a = We.file(r.data("files")[0]).phash === n, o.data("dropover") === n ? st.each(r.data("files"), function (e, t) {
                                if (t === n || a && !s && !r.hasClass("elfinder-drag-helper-plus")) return o.removeClass(c), !1
                            }) : o.removeClass(c), r.data("locked") || a ? i = "elfinder-drag-helper-plus" : (i = "elfinder-drag-helper-move", s && (i += " elfinder-drag-helper-plus")), o.hasClass(c) && r.addClass(i), requestAnimationFrame(function () {
                                o.hasClass(c) && r.addClass(i)
                            })) : o.removeClass(c)
                        },
                        out: function (e, t) {
                            t = t.helper;
                            e.stopPropagation(), t.removeClass("elfinder-drag-helper-move elfinder-drag-helper-plus").data("dropover", Math.max(t.data("dropover") - 1, 0)), st(this).removeData("dropover").removeClass(c)
                        },
                        deactivate: function () {
                            st(this).removeData("dropover").removeClass(c)
                        },
                        drop: function (e, t) {
                            T({
                                notrigger: !0
                            }), We.droppable.drop.call(this, e, t)
                        }
                    }),
                    je = function (e) {
                        var t = (e = e || (v ? F.find("tbody") : F)).children(".directory:not(." + X + ",.elfinder-na,.elfinder-ro)");
                        We.isCommandEnabled("paste") && t.droppable(Ae), We.isCommandEnabled("upload") && t.addClass("native-droppable"), e.children(".isroot").each(function (e, t) {
                            var n = st(t),
                                t = We.cwdId2Hash(t.id);
                            We.isCommandEnabled("paste", t) ? n.hasClass(X + ",elfinder-na,elfinder-ro") || n.droppable(Ae) : n.hasClass(X) && n.droppable("destroy"), We.isCommandEnabled("upload", t) ? n.hasClass("native-droppable,elfinder-na,elfinder-ro") || n.addClass("native-droppable") : n.hasClass("native-droppable") && n.removeClass("native-droppable")
                        })
                    },
                    Se = function (e, r) {
                        function t(e, t) {
                            var n, i, a, o = We.cwdHash2Elm(e);
                            o.length && ("1" != t ? ((n = We.file(e)).tmb !== t && (n.tmb = t), t = We.tmb(n), r ? o.find(".elfinder-cwd-icon").addClass(t.className).css("background-image", "url('" + t.url + "')") : (i = o, a = t, st("<img/>").on("load", function () {
                                i.find(".elfinder-cwd-icon").addClass(a.className).css("background-image", "url('" + a.url + "')")
                            }).attr("src", a.url)), delete S.attachTmbs[e]) : r ? Oe([e]) : S.tmbLoading[e] || S.getTmbs.push(e))
                        }
                        st.isPlainObject(e) && Object.keys(e).length && (Object.assign(S.attachTmbs, e), st.each(e, t), r || !S.getTmbs.length || Object.keys(S.tmbLoading).length || Oe())
                    },
                    Oe = function (t) {
                        var a = [],
                            o = !1;
                        We.oldAPI ? We.request({
                            data: {
                                cmd: "tmb",
                                current: We.cwd().hash
                            },
                            preventFail: !0
                        }).done(function (e) {
                            e.images && Object.keys(e.images).length && Se(e.images), e.tmb && Oe()
                        }) : (a = t ? (o = !0, t.splice(0, G)) : S.getTmbs.splice(0, G)).length && (o || ye[a[0]] || ye[a[a.length - 1]]) && (st.each(a, function (e, t) {
                            S.tmbLoading[t] = !0
                        }), We.request({
                            data: {
                                cmd: "tmb",
                                targets: a
                            },
                            preventFail: !0
                        }).done(function (n) {
                            var e, i = [];
                            n.images && ((e = Object.keys(n.images).length) ? (e < a.length && st.each(a, function (e, t) {
                                n.images[t] || i.push(t)
                            }), Se(n.images, o)) : i = a, i.length && st.each(i, function (e, t) {
                                delete S.attachTmbs[t]
                            })), o && t.length && Oe(t)
                        }).always(function () {
                            S.tmbLoading = {}, !o && S.getTmbs.length && Oe()
                        }))
                    },
                    Ie = function () {
                        for (var e, t = "", n = 0; n < w.length; n++) e = We.getColumnName(w[n]), t += '<td class="elfinder-cwd-view-th-' + w[n] + ' sortable-item">' + e + "</td>";
                        return t
                    },
                    Me = function (e) {
                        var t;
                        e.height || (t = (v ? F.find("tbody") : F).find(v ? "tr:first" : "[id]:first"), e.height = t.outerHeight(!0), v || (e.width = t.outerWidth(!0)))
                    },
                    Ee = function (e, t) {
                        var e = e || (v ? F.find("tbody") : F),
                            n = Le[We.viewType],
                            i = 1;
                        0 < j.length && (S.hpi ? v || (i = Math.floor(e.width() / n.width)) : (Me(n), v ? S.row = S.hpi = n.height : (i = Math.floor(e.width() / n.width), S.row = n.height, S.hpi = S.row / i)), e = Math.ceil((j.length + (t || 0)) / i), v && M && ++e, qe.css({
                            top: S.row * e + "px"
                        }).show())
                    },
                    De = function (e) {
                        e.preventDefault(), void 0 !== F.data("longtap") ? e.stopPropagation() : We.trigger("contextmenu", {
                            type: "cwd",
                            targets: [We.cwd().hash],
                            x: e.pageX,
                            y: e.pageY
                        })
                    },
                    Fe = function (e) {
                        1 < e.originalEvent.touches.length || (!1 !== F.data("longtap") && (U.data("touching", {
                            x: e.originalEvent.touches[0].pageX,
                            y: e.originalEvent.touches[0].pageY
                        }), F.data("tmlongtap", setTimeout(function () {
                            F.data("longtap", !0), We.trigger("contextmenu", {
                                type: "cwd",
                                targets: [We.cwd().hash],
                                x: U.data("touching").x,
                                y: U.data("touching").y
                            })
                        }, 500))), F.data("longtap", null))
                    },
                    Ue = function (e) {
                        "touchmove" === e.type ? (!U.data("touching") || 4 < Math.abs(U.data("touching").x - e.originalEvent.touches[0].pageX) + Math.abs(U.data("touching").y - e.originalEvent.touches[0].pageY)) && U.data("touching", null) : setTimeout(function () {
                            F.removeData("longtap")
                        }, 80), clearTimeout(F.data("tmlongtap"))
                    },
                    Pe = function (e) {
                        F.data("longtap") && (e.preventDefault(), e.stopPropagation())
                    },
                    D = function () {
                        We.lazy(function () {
                            var e;
                            R.append(P).removeClass("elfinder-cwd-wrapper-empty elfinder-search-result elfinder-incsearch-result elfinder-letsearch-result"), (1 < We.searchStatus.state || We.searchStatus.ininc) && R.addClass("elfinder-search-result" + (We.searchStatus.ininc ? " elfinder-" + ("/" === g.substr(0, 1) ? "let" : "inc") + "search-result" : "")), S.attachThumbJob && S.attachThumbJob._abort(), F.data("selectable") && F.selectable("disable").selectable("destroy").removeData("selectable"), We.trigger("cwdinit"), de = st();
                            try {
                                F.empty()
                            } catch (e) {
                                F.html("")
                            }
                            M && (U.off("scroll.fixheader resize.fixheader"), M.remove(), M = null), F.removeClass("elfinder-cwd-view-icons elfinder-cwd-view-list").addClass("elfinder-cwd-view-" + (v ? "list" : "icons")).attr("style", "").css("height", "auto"), qe.hide(), U[v ? "addClass" : "removeClass"]("elfinder-cwd-wrapper-list")._padding = parseInt(U.css("padding-top")) + parseInt(U.css("padding-bottom")), We.UA.iOS && U.removeClass("overflow-scrolling-touch").addClass("overflow-scrolling-touch"), v && (F.html("<table><thead></thead><tbody></tbody></table>"), e = st('<tr class="ui-state-default"><td class="elfinder-cwd-view-th-name">' + We.getColumnName("name") + "</td>" + Ie() + "</tr>"), F.find("thead").hide().append(e).find("td:first").append(P), st.fn.sortable && e.addClass("touch-punch touch-punch-keep-default").sortable({
                                axis: "x",
                                distance: 8,
                                items: "> .sortable-item",
                                start: function (e, t) {
                                    st(t.item[0]).data("dragging", !0), t.placeholder.width(t.helper.removeClass("ui-state-hover").width()).removeClass("ui-state-active").addClass("ui-state-hover").css("visibility", "visible")
                                },
                                update: function (e, t) {
                                    var n, i, a = st(t.item[0]).attr("class").split(" ")[0].replace("elfinder-cwd-view-th-", "");
                                    w = st.map(st(this).children(), function (e) {
                                        e = st(e).attr("class").split(" ")[0].replace("elfinder-cwd-view-th-", "");
                                        return i || (a === e ? i = !0 : n = e), "name" === e ? null : e
                                    }), ne.row = ee(), We.storage("cwdCols", w), n = ".elfinder-col-" + n + ":first", a = ".elfinder-col-" + a + ":first", We.lazy(function () {
                                        F.find("tbody tr").each(function () {
                                            var e = st(this);
                                            e.children(n).after(e.children(a))
                                        })
                                    })
                                },
                                stop: function (e, t) {
                                    setTimeout(function () {
                                        st(t.item[0]).removeData("dragging")
                                    }, 100)
                                }
                            }), e.find("td").addClass("touch-punch").resizable({
                                handles: "ltr" === We.direction ? "e" : "w",
                                start: function (e, t) {
                                    var n = F.find("td.elfinder-col-" + t.element.attr("class").split(" ")[0].replace("elfinder-cwd-view-th-", "") + ":first");
                                    t.element.data("dragging", !0).data("resizeTarget", n).data("targetWidth", n.width()), te = !0, "fixed" !== F.find("table").css("table-layout") && (F.find("tbody tr:first td").each(function () {
                                        st(this).width(st(this).width())
                                    }), F.find("table").css("table-layout", "fixed"))
                                },
                                resize: function (e, t) {
                                    t.element.data("resizeTarget").width(t.element.data("targetWidth") - (t.originalSize.width - t.size.width))
                                },
                                stop: function (e, t) {
                                    E({
                                        fitWidth: !(te = !1)
                                    }), C = {}, F.find("tbody tr:first td").each(function () {
                                        var e = st(this).attr("class").split(" ")[0].replace("elfinder-col-", "");
                                        C[e] = st(this).width()
                                    }), We.storage("cwdColWidth", C), setTimeout(function () {
                                        t.element.removeData("dragging")
                                    }, 100)
                                }
                            }).find(".ui-resizable-handle").addClass("ui-icon ui-icon-grip-dotted-vertical")), j = st.map(r || d, function (e) {
                                return We.file(e) || null
                            }), j = We.sortFiles(j), r ? r = st.map(j, function (e) {
                                return e.hash
                            }) : d = st.map(j, function (e) {
                                return e.hash
                            }), S = {
                                renderd: 0,
                                attachTmbs: {},
                                getTmbs: [],
                                tmbLoading: {},
                                lazyOpts: {
                                    tm: 0
                                }
                            }, R[j.length < 1 ? "addClass" : "removeClass"]("elfinder-cwd-wrapper-empty"), U.off(O, Ce).on(O, Ce).trigger(O), We.cwd().write ? (U[We.isCommandEnabled("upload") ? "addClass" : "removeClass"]("native-droppable"), U.droppable(We.isCommandEnabled("paste") ? "enable" : "disable")) : U.removeClass("native-droppable").droppable("disable").removeClass("ui-state-disabled")
                        })
                    },
                    F = st(this).addClass("ui-helper-clearfix elfinder-cwd").attr("unselectable", "on").on("click." + We.namespace, y, function (e) {
                        var t, n, i, a, o = this.id ? st(this) : st(this).parents("[id]:first"),
                            r = st(e.target);
                        if (k && (r.is("input:checkbox." + s) || r.hasClass("elfinder-cwd-select"))) return e.stopPropagation(), e.preventDefault(), o.trigger(o.hasClass(f) ? h : p), A(), void requestAnimationFrame(function () {
                            r.prop("checked", o.hasClass(f))
                        });
                        if (F.data("longtap") || r.hasClass("elfinder-cwd-nonselect")) e.stopPropagation();
                        else {
                            if (x || (x = o.attr("id"), setTimeout(function () {
                                x = ""
                            }, 500)), e.shiftKey && (t = o.prevAll(fe || "." + f + ":first"), n = o.nextAll(fe || "." + f + ":first"), i = t.length, a = n.length), e.shiftKey && (i || a)) a = (a = i ? o.prevUntil("#" + t.attr("id")) : o.nextUntil("#" + n.attr("id"))).add(o), (a = i ? a : st(a.get().reverse())).trigger(p);
                            else if (e.ctrlKey || e.metaKey) o.trigger(o.hasClass(f) ? h : p);
                            else {
                                if (U.data("touching") && o.hasClass(f)) return U.data("touching", null), void We.dblclick({
                                    file: We.cwdId2Hash(this.id)
                                });
                                T({
                                    notrigger: !0
                                }), o.trigger(p)
                            }
                            A()
                        }
                    }).on("dblclick." + We.namespace, y, function (e) {
                        var t;
                        x && (t = We.cwdId2Hash(x), e.stopPropagation(), this.id !== x && (st(this).trigger(h), st("#" + x).trigger(p), A()), We.dblclick({
                            file: t
                        }))
                    }).on("touchstart." + We.namespace, y, function (e) {
                        if (!(1 < e.originalEvent.touches.length)) {
                            var t = this.id ? st(this) : st(this).parents("[id]:first"),
                                n = st(e.target),
                                i = e.target.nodeName;
                            if ("INPUT" === i && "text" === e.target.type || "TEXTAREA" === i || n.hasClass("elfinder-cwd-nonselect")) e.stopPropagation();
                            else {
                                if (t.find("input:text,textarea").length) return e.stopPropagation(), void e.preventDefault();
                                U.data("touching", {
                                    x: e.originalEvent.touches[0].pageX,
                                    y: e.originalEvent.touches[0].pageY
                                }), k && (n.is("input:checkbox." + s) || n.hasClass("elfinder-cwd-select")) || (t.prevAll("." + f + ":first").length, t.nextAll("." + f + ":first").length, F.data("longtap", null), (Object.keys(z).length || v && "TD" !== e.target.nodeName || !v && this !== e.target) && (F.data("longtap", !1), t.addClass(o), t.data("tmlongtap", setTimeout(function () {
                                    F.data("longtap", !0), t.trigger(p), A(), We.trigger("contextmenu", {
                                        type: "files",
                                        targets: We.selected(),
                                        x: e.originalEvent.touches[0].pageX,
                                        y: e.originalEvent.touches[0].pageY
                                    })
                                }, 500))))
                            }
                        }
                    }).on("touchmove." + We.namespace + " touchend." + We.namespace, y, function (e) {
                        var t = st(e.target);
                        k && (t.is("input:checkbox." + s) || t.hasClass("elfinder-cwd-select")) || ("INPUT" == e.target.nodeName || "TEXTAREA" == e.target.nodeName ? e.stopPropagation() : (t = this.id ? st(this) : st(this).parents("[id]:first"), clearTimeout(t.data("tmlongtap")), "touchmove" === e.type ? (U.data("touching", null), t.removeClass(o)) : (U.data("touching") && !F.data("longtap") && t.hasClass(f) && (e.preventDefault(), U.data("touching", null), We.dblclick({
                            file: We.cwdId2Hash(this.id)
                        })), setTimeout(function () {
                            F.removeData("longtap")
                        }, 80))))
                    }).on("mouseenter." + We.namespace, y, function (e) {
                        var i, c;
                        ve || (i = st(this), c = null, u || i.data("dragRegisted") || i.hasClass(J) || i.hasClass(K) || i.hasClass(m) || (i.data("dragRegisted", !0), (We.isCommandEnabled("copy", 1 < We.searchStatus.state || i.hasClass("isroot") ? We.cwdId2Hash(i.attr("id")) : void 0) || We.isCommandEnabled("cut", 1 < We.searchStatus.state || i.hasClass("isroot") ? We.cwdId2Hash(i.attr("id")) : void 0)) && i.on("mousedown", function (e) {
                            var t = Be.metakeyDragout && !We.UA.IE && (e.shiftKey || e.altKey),
                                n = !1;
                            t && F.data("selectable") && (F.selectable("disable").selectable("destroy").removeData("selectable"), requestAnimationFrame(function () {
                                F.selectable(be).selectable("option", {
                                    disabled: !1
                                }).selectable("refresh").data("selectable", !0)
                            })), i.removeClass("ui-state-disabled"), t ? i.draggable("option", "disabled", !0).attr("draggable", "true") : (n = i.hasClass(f) ? n : v ? st(e.target).closest("span,tr").is("tr") : st(e.target).hasClass("elfinder-cwd-file")) ? i.draggable("option", "disabled", !0).removeClass("ui-state-disabled") : i.draggable("option", "disabled", !1).removeAttr("draggable").draggable("option", "cursorAt", {
                                left: 50 - parseInt(st(e.currentTarget).css("margin-left")),
                                top: 47
                            })
                        }).on("dragstart", function (e) {
                            var i, a, o, r, s, t, n, l, e = e.dataTransfer || e.originalEvent.dataTransfer || null;
                            if (c = null, e && !We.UA.IE) return n = this.id ? st(this) : st(this).parents("[id]:first"), i = st("<span>"), a = "", r = o = null, s = [], t = function (e) {
                                var t = e.mime,
                                    e = We.tmb(e),
                                    t = '<div class="elfinder-cwd-icon elfinder-cwd-icon-drag ' + We.mime2class(t) + ' ui-corner-all"></div>';
                                return t = e ? st(t).addClass(e.className).css("background-image", "url('" + e.url + "')").get(0).outerHTML : t
                            }, l = [], n.trigger(p), A(), st.each(z, function (e) {
                                var t = We.file(e),
                                    n = t.url;
                                if (t && "directory" !== t.mime) {
                                    if (n) {
                                        if ("1" == n) return l.push(e), !0
                                    } else n = We.url(t.hash);
                                    n && (n = We.convAbsUrl(n), s.push(e), st("<a>").attr("href", n).text(n).appendTo(i), a += n + "\n", o = o || t.mime + ":" + t.name + ":" + n, r = r || n + "\n" + t.name)
                                }
                            }), l.length ? (st.each(l, function (e, t) {
                                var n = We.file(t);
                                n.url = "", We.request({
                                    data: {
                                        cmd: "url",
                                        target: t
                                    },
                                    notify: {
                                        type: "url",
                                        cnt: 1
                                    },
                                    preventDefault: !0
                                }).always(function (e) {
                                    n.url = e.url || "1"
                                })
                            }), !1) : !!a && (e.setDragImage && (c = st('<div class="elfinder-drag-helper html5-native"></div>').append(t(We.file(s[0]))).appendTo(st(document.body)), 1 < (n = s.length) && c.append(t(We.file(s[n - 1])) + '<span class="elfinder-drag-num">' + n + "</span>"), e.setDragImage(c.get(0), 50, 47)), e.effectAllowed = "copyLink", e.setData("DownloadURL", o), e.setData("text/x-moz-url", r), e.setData("text/uri-list", a), e.setData("text/plain", a), e.setData("text/html", i.html()), e.setData("elfinderfrom", window.location.href + We.cwd().hash), void e.setData("elfinderfrom:" + e.getData("elfinderfrom"), ""))
                        }).on("dragend", function (e) {
                            T({
                                notrigger: !0
                            }), c && c.remove()
                        }).draggable(We.draggable)))
                    }).on(p, y, function (e) {
                        var t = st(this),
                            n = We.cwdId2Hash(t.attr("id"));
                        pe || t.hasClass(m) || (fe = "#" + this.id, t.addClass(f).children().addClass(o).find("input:checkbox." + s).prop("checked", !0), z[n] || (z[n] = !0), de = F.find("[id]." + f + ":last").next())
                    }).on(h, y, function (e) {
                        var t = st(this),
                            n = We.cwdId2Hash(t.attr("id"));
                        pe || (t.removeClass(f).children().removeClass(o).find("input:checkbox." + s).prop("checked", !1), F.hasClass("elfinder-cwd-allselected") && (k && P.children("input").prop("checked", !1), F.removeClass("elfinder-cwd-allselected")), z[n] && delete z[n])
                    }).on($, y, function () {
                        var e = st(this).removeClass(o + " " + f).addClass(m),
                            t = e.children(),
                            n = v ? e : t.find("div.elfinder-cwd-file-wrapper,div.elfinder-cwd-filename");
                        t.removeClass(o + " " + f), e.hasClass(X) && e.droppable("disable"), n.hasClass(K) && n.draggable("disable")
                    }).on(V, y, function () {
                        var e = st(this).removeClass(m),
                            t = v ? e : e.children("div.elfinder-cwd-file-wrapper,div.elfinder-cwd-filename");
                        e.hasClass(X) && e.droppable("enable"), t.hasClass(K) && t.draggable("enable")
                    }).on("scrolltoview", y, function (e, t) {
                        me(st(this), !t || void 0 === t.blink || t.blink)
                    }).on("mouseenter." + We.namespace + " mouseleave." + We.namespace, y, function (e) {
                        "mouseenter" === e.type && (ve || We.UA.Mobile) || (We.trigger("hover", {
                            hash: We.cwdId2Hash(st(this).attr("id")),
                            type: e.type
                        }), st(this).toggleClass(o, "mouseenter" == e.type))
                    }).on("mouseenter." + We.namespace + " mouseleave." + We.namespace, ".elfinder-cwd-file-wrapper,.elfinder-cwd-filename", function (e) {
                        "mouseenter" === e.type && ve || st(this).closest(y).children(".elfinder-cwd-file-wrapper,.elfinder-cwd-filename").toggleClass(t, "mouseenter" == e.type)
                    }).on("contextmenu." + We.namespace, function (e) {
                        var t = st(e.target).closest(y);
                        t.get(0) === e.target && !z[We.cwdId2Hash(t.get(0).id)] || (t.find("input:text,textarea").length ? e.stopPropagation() : t.length && ("TD" != e.target.nodeName || z[We.cwdId2Hash(t.get(0).id)]) && (e.stopPropagation(), e.preventDefault(), t.hasClass(m) || U.data("touching") || (t.hasClass(f) || (T({
                            notrigger: !0
                        }), t.trigger(p), A()), We.trigger("contextmenu", {
                            type: "files",
                            targets: We.selected(),
                            x: e.pageX,
                            y: e.pageY
                        }))))
                    }).on("click." + We.namespace, function (e) {
                        e.target !== this || F.data("longtap") || e.shiftKey || e.ctrlKey || e.metaKey || T()
                    }).on("create." + We.namespace, function (e, t) {
                        var n = v ? F.find("tbody") : F,
                            i = n.find(".elfinder-cwd-parent"),
                            a = t.move || !1,
                            t = st(ce(t)).addClass(J),
                            o = We.selected();
                        o.length ? a && We.trigger("lockfiles", {
                            files: o
                        }) : T(), i.length ? i.after(t) : n.prepend(t), Te(), U.scrollTop(0).scrollLeft(0)
                    }).on("unselectall", T).on("selectfile", function (e, t) {
                        We.cwdHash2Elm(t).trigger(p), A()
                    }).on("colwidth", function () {
                        v && (F.find("table").css("table-layout", "").find("td").css("width", ""), E({
                            fitWidth: !0
                        }), We.storage("cwdColWidth", C = null))
                    }).on("iconpref", function (e, t) {
                        F.removeClass(function (e, t) {
                            return (t.match(/\belfinder-cwd-size\S+/g) || []).join(" ")
                        }), n = t && parseInt(t.size) || 0, v || (0 < n && F.addClass("elfinder-cwd-size" + n), S.renderd && requestAnimationFrame(function () {
                            Le.icons = {}, S.hpi = null, Ee(F, S.renderd), we()
                        }))
                    }).on("onwheel" in document ? "wheel" : "mousewheel", function (e) {
                        var t;
                        !v && (e.ctrlKey && !e.metaKey || !e.ctrlKey && e.metaKey) && (e.stopPropagation(), e.preventDefault(), void 0 !== (t = F.data("wheelTm")) ? (clearTimeout(t), F.data("wheelTm", setTimeout(function () {
                            F.removeData("wheelTm")
                        }, 200))) : (F.data("wheelTm", !1), t = n || 0, 0 < (e.originalEvent.deltaY || -e.originalEvent.wheelDelta) ? 0 < n && (t = n - 1) : n < Be.iconsView.sizeMax && (t = n + 1), t !== n && (We.storage("iconsize", t), F.trigger("iconpref", {
                            size: t
                        }))))
                    }),
                    U = st('<div class="elfinder-cwd-wrapper"></div>').droppable(Object.assign({}, Ae, {
                        autoDisable: !1
                    })).on("contextmenu." + We.namespace, De).on("touchstart." + We.namespace, Fe).on("touchmove." + We.namespace + " touchend." + We.namespace, Ue).on("click." + We.namespace, Pe).on("scroll." + We.namespace, function () {
                        ve || (F.data("selectable") && F.selectable("disable"), U.trigger("elfscrstart")), ve = !0, S.scrtm && cancelAnimationFrame(S.scrtm), S.scrtm && Math.abs((S.scrolltop || 0) - (S.scrolltop = this.scrollTop || st(this).scrollTop())) < 5 && (S.scrtm = 0, U.trigger(O)), S.scrtm = requestAnimationFrame(function () {
                            S.scrtm = 0, U.trigger(O)
                        })
                    }).on(O, function () {
                        ve = !1, we()
                    }),
                    qe = st("<div>&nbsp;</div>").css({
                        position: "absolute",
                        width: "1px",
                        height: "1px"
                    }).hide(),
                    P = k ? st('<div class="elfinder-cwd-selectall"><input type="checkbox"/></div>').attr("title", We.i18n("selectall")).on("click", function (e) {
                        if (e.stopPropagation(), e.preventDefault(), st(this).data("pending")) return !1;
                        P.data("pending", !0), F.hasClass("elfinder-cwd-allselected") ? (P.find("input").prop("checked", !1), requestAnimationFrame(function () {
                            T()
                        })) : he()
                    }) : st(),
                    Re = null,
                    q = function (t) {
                        function n() {
                            var e;
                            void 0 !== S.renderd && (e = 0, U.siblings("div.elfinder-panel:visible").each(function () {
                                e += st(this).outerHeight(!0)
                            }), U.height(R.height() - e - U._padding))
                        }
                        t && n(), Re && cancelAnimationFrame(Re), Re = requestAnimationFrame(function () {
                            var e;
                            t || n(), F.css("height", "auto"), e = U[0].clientHeight - parseInt(U.css("padding-top")) - parseInt(U.css("padding-bottom")) - parseInt(F.css("margin-top")), F.outerHeight(!0) < e && F.height(e)
                        }), v && !te && (t ? U.trigger("resize.fixheader") : E()), we()
                    },
                    R = st(this).parent().on("resize", q).children(".elfinder-workzone").append(U.append(this).append(qe)),
                    He = st('<div class="elfinder-cwd-message-board"></div>').insertAfter(F),
                    _e = st('<div class="elfinder-cwd-expires" ></div>'),
                    Ne = function () {
                        var e, t;
                        i && clearTimeout(i), a && We.volumeExpires[a] && (t = (e = We.volumeExpires[a] - +new Date / 1e3) % 60 + .1, e = Math.floor(e / 60), _e.html(We.i18n(["minsLeft", e])).show(), e && (i = setTimeout(Ne, 1e3 * t)))
                    },
                    Le = {
                        icons: {},
                        list: {}
                    };
                We.UA.ltIE10 || He.append(st('<div class="elfinder-cwd-trash" ></div>').html(We.i18n("volume_Trash"))).append(_e), re = Object.assign(re, Be.replacement || {});
                try {
                    C = We.storage("cwdColWidth") ? We.storage("cwdColWidth") : null
                } catch (e) {
                    C = null
                }
                We.bind("columnpref", function (e) {
                    var e = e.data || {},
                        t = ((w = We.storage("cwdCols")) ? (w = st.grep(w, function (e) {
                            return -1 !== Be.listView.columns.indexOf(e)
                        }), Be.listView.columns.length > w.length && st.each(Be.listView.columns, function (e, t) {
                            -1 === w.indexOf(t) && w.push(t)
                        })) : w = Be.listView.columns, We.storage("columnhides") || null);
                    t && Object.keys(t).length && (w = st.grep(w, function (e) {
                        return !t[e]
                    })), ne.row = ee(), v && e.repaint && D()
                }).trigger("columnpref"), u && st("body").on("touchstart touchmove touchend", function (e) { }), k && F.addClass("elfinder-has-checkbox"), st(window).on("scroll." + We.namespace, function () {
                    e && cancelAnimationFrame(e), e = requestAnimationFrame(function () {
                        U.trigger(O)
                    })
                }), st(document).on("keydown." + We.namespace, function (e) {
                    e.keyCode != st.ui.keyCode.ESCAPE || We.getUI().find(".ui-widget:visible").length || T()
                }), We.one("init", function () {
                    var e, n, i, t = document.createElement("style"),
                        a = 0;
                    document.head && (document.head.appendChild(t), (e = t.sheet).insertRule('.elfinder-cwd-wrapper-empty .elfinder-cwd:not(.elfinder-table-header-sticky):after{ content:"' + We.i18n("emptyFolder") + '" }', a++), e.insertRule('.elfinder-cwd-wrapper-empty .native-droppable .elfinder-cwd:not(.elfinder-table-header-sticky):after{ content:"' + We.i18n("emptyFolder" + (u ? "LTap" : "Drop")) + '" }', a++), e.insertRule('.elfinder-cwd-wrapper-empty .ui-droppable-disabled .elfinder-cwd:not(.elfinder-table-header-sticky):after{ content:"' + We.i18n("emptyFolder") + '" }', a++), e.insertRule('.elfinder-cwd-wrapper-empty.elfinder-search-result .elfinder-cwd:not(.elfinder-table-header-sticky):after{ content:"' + We.i18n("emptySearch") + '" }', a++), e.insertRule('.elfinder-cwd-wrapper-empty.elfinder-search-result.elfinder-incsearch-result .elfinder-cwd:not(.elfinder-table-header-sticky):after{ content:"' + We.i18n("emptyIncSearch") + '" }', a++), e.insertRule('.elfinder-cwd-wrapper-empty.elfinder-search-result.elfinder-letsearch-result .elfinder-cwd:not(.elfinder-table-header-sticky):after{ content:"' + We.i18n("emptyLetSearch") + '" }', a++)), (t = We.storage("iconsize") || Be.iconsView.size || 0) && (t = Math.min(t, Be.iconsView.sizeMax), F.trigger("iconpref", {
                        size: t
                    })), u || (We.one("open", function () {
                        e && We.zIndex && e.insertRule(".ui-selectable-helper{z-index:" + We.zIndex + ";}", a++)
                    }), i = st('<div style="position:absolute"></div>'), (n = We.getUI()).on("resize", function (e, t) {
                        e.preventDefault(), e.stopPropagation(), t && t.fullscreen && (e = n.offset(), "on" === t.fullscreen ? (i.css({
                            top: -1 * e.top,
                            left: -1 * e.left
                        }).appendTo(n), be.appendTo = i) : (i.detach(), be.appendTo = "body"), F.data("selectable") && F.selectable("option", {
                            appendTo: be.appendTo
                        }))
                    })), B = We.getUI("tree").length
                }).bind("enable", function () {
                    q()
                }).bind("request.open", function () {
                    S.getTmbs = []
                }).one("open", function () {
                    We.maxTargets && (G = Math.min(We.maxTargets, G))
                }).bind("open add remove searchend", function () {
                    var e, t, n = We.cwd().hash,
                        i = this.type;
                    ("open" === i || "searchend" === i || We.searchStatus.state < 2) && (d = st.map(We.files(n), function (e) {
                        return e.hash
                    }), We.trigger("cwdhasheschange", d)), "open" === i && (i = n && (!We.file(n) || B) ? B ? (t = st.Deferred(), We.one("treesync", function (e) {
                        e.data.always(function () {
                            t.resolve()
                        })
                    }), t) : We.request({
                        data: {
                            cmd: "parents",
                            target: We.cwd().hash
                        },
                        preventFail: !0
                    }) : null, (e = We.cwd()).volumeid !== a && (_e.empty().hide(), a && U.removeClass("elfinder-cwd-wrapper-" + a), a = e.volumeid, Ne(), U.addClass("elfinder-cwd-wrapper-" + a)), st.when(i).done(function () {
                        var n;
                        Q = We.parents(e.hash), U[n = !1, st.each(Q, function (e, t) {
                            if (We.trashes[t]) return !(n = !0)
                        }), n ? "addClass" : "removeClass"]("elfinder-cwd-wrapper-trash")
                    }), T({
                        notrigger: !(r = void 0)
                    }), D())
                }).bind("search", function (e) {
                    d = st.map(e.data.files, function (e) {
                        return e.hash
                    }), We.trigger("cwdhasheschange", d), r = void 0, We.searchStatus.ininc = !1, D(), We.autoSync("stop")
                }).bind("searchend", function (e) {
                    (g || r) && (g = "", r ? We.trigger("incsearchend", e.data) : e.data && e.data.noupdate || D()), We.autoSync()
                }).bind("searchstart", function (e) {
                    T(), g = e.data.query
                }).bind("incsearchstart", function (e) {
                    var i = e.data.query || "",
                        a = e.data.type || "SearchName",
                        o = We.options.commandsOptions.search.searchTypes || {};
                    (o[a] && o[a].incsearch || "SearchName" === a) && (z = {}, We.lazy(function () {
                        var t, n, e = "";
                        if (g = i) {
                            if ("/" === i.substr(0, 1) && (i = i.substr(1), e = "^"), t = new RegExp(e + i.replace(/([\\*\;\.\?\[\]\{\}\(\)\^\$\-\|])/g, "\\$1"), "i"), "SearchName" === a) r = st.grep(d, function (e) {
                                e = We.file(e);
                                return !(!e || !(e.name.match(t) || e.i18 && e.i18.match(t)))
                            });
                            else if ("string" == typeof (n = o[a].incsearch)) r = st.grep(d, function (e) {
                                e = We.file(e);
                                return !!(e && e[n] && (e[n] + "").match(t))
                            });
                            else if ("function" == typeof n) try {
                                r = st.grep(n({
                                    val: i,
                                    regex: t
                                }, d, We), function (e) {
                                    return !!We.file(e)
                                })
                            } catch (e) {
                                r = []
                            }
                            We.trigger("incsearch", {
                                hashes: r,
                                query: i
                            }).searchStatus.ininc = !0, D(), We.autoSync("stop")
                        } else We.trigger("incsearchend")
                    }))
                }).bind("incsearchend", function (e) {
                    g = "", We.searchStatus.ininc = !1, r = void 0, e.data && e.data.noupdate || D(), We.autoSync()
                }).bind("sortchange", function () {
                    var e = U.scrollLeft(),
                        t = F.hasClass("elfinder-cwd-allselected");
                    D(), We.one("cwdrender", function () {
                        U.scrollLeft(e), t && (z = We.arrayFlip(r || d, !0)), (t || Object.keys(z).length) && A()
                    })
                }).bind("viewchange", function () {
                    var e = "list" != We.viewType,
                        t = F.hasClass("elfinder-cwd-allselected");
                    e != v && (v = e, We.viewType = v ? "list" : "icons", n && We.one("cwdinit", function () {
                        F.trigger("iconpref", {
                            size: n
                        })
                    }), D(), q(), t && (F.addClass("elfinder-cwd-allselected"), P.find("input").prop("checked", !0)), Object.keys(z).length && A())
                }).bind("wzresize", function () {
                    var e, t = v ? F.find("tbody") : F;
                    q(!0), S.hpi && Ee(t, t.find("[id]").length), e = F.offset(), R.data("rectangle", Object.assign({
                        width: R.width(),
                        height: R.height(),
                        cwdEdge: "ltr" === We.direction ? e.left : e.left + F.width()
                    }, R.offset())), S.itemH = (v ? t.find("tr:first") : t.find("[id]:first")).outerHeight(!0)
                }).bind("changeclipboard", function (e) {
                    Y = {}, e.data && e.data.clipboard && e.data.clipboard.length && st.each(e.data.clipboard, function (e, t) {
                        t.cut && (Y[t.hash] = !0)
                    })
                }).bind("resMixinMake", function () {
                    Te()
                }).bind("tmbreload", function (e) {
                    var n = {},
                        e = e.data && e.data.files ? e.data.files : null;
                    st.each(e, function (e, t) {
                        t.tmb && "1" != t.tmb && (n[t.hash] = t.tmb)
                    }), Object.keys(n).length && Se(n, !0)
                }).add(function (e) {
                    var i = g ? new RegExp(g.replace(/([\\*\;\.\?\[\]\{\}\(\)\^\$\-\|])/g, "\\$1"), "i") : null,
                        a = We.searchStatus.mime,
                        o = 1 < We.searchStatus.state,
                        r = o && We.searchStatus.target ? We.searchStatus.target : We.cwd().hash,
                        s = We.path(r),
                        e = st.grep(e.data.added || [], function (e) {
                            return !(e = (t = e).phash === r) && o && (n = t.path || We.path(t.hash), !(e = s && 0 === n.indexOf(s)) && We.searchStatus.mixed && (e = !!st.grep(We.searchStatus.mixed, function (e) {
                                return 0 === t.hash.indexOf(e)
                            }).length)), !!(e = e && o ? a ? 0 === t.mime.indexOf(a) : !!(t.name.match(i) || t.i18 && t.i18.match(i)) : e);
                            var t, n
                        });
                    _(e), 2 === We.searchStatus.state && (st.each(e, function (e, t) {
                        -1 === st.inArray(t.hash, d) && d.push(t.hash)
                    }), We.trigger("cwdhasheschange", d)), v && q(), U.trigger(O)
                }).change(function (e) {
                    var n, t = We.cwd().hash,
                        i = We.selected();
                    g ? st.each(e.data.changed || [], function (e, t) {
                        We.cwdHash2Elm(t.hash).length && (N([t.hash]), _([t]), -1 !== st.inArray(t.hash, i) && H(t.hash), n = !0)
                    }) : st.each(st.grep(e.data.changed || [], function (e) {
                        return e.phash == t
                    }), function (e, t) {
                        We.cwdHash2Elm(t.hash).length && (N([t.hash]), _([t]), -1 !== st.inArray(t.hash, i) && H(t.hash), n = !0)
                    }), n && (We.trigger("cwdhasheschange", d), v && q(), U.trigger(O)), A()
                }).remove(function (e) {
                    var t = v ? F.find("tbody") : F;
                    N(e.data.removed || []), A(), j.length < 1 && t.children(y + (Be.oldSchool ? ":not(.elfinder-cwd-parent)" : "")).length < 1 ? (R.addClass("elfinder-cwd-wrapper-empty"), k && P.find("input").prop("checked", !1), qe.hide(), U.off(O, Ce), q()) : (Ee(t), U.trigger(O))
                }).dragstart(function (e) {
                    var t = st(e.data.target),
                        e = e.data.originalEvent;
                    t.hasClass(b) && !t.hasClass(f) && (e.ctrlKey || e.metaKey || e.shiftKey || T({
                        notrigger: !0
                    }), t.trigger(p), A()), F.removeClass(m).data("selectable") && F.selectable("disable"), pe = !0
                }).dragstop(function () {
                    F.data("selectable") && F.selectable("enable"), pe = !1
                }).bind("lockfiles unlockfiles selectfiles unselectfiles", function (e) {
                    var t, i, n = {
                        lockfiles: $,
                        unlockfiles: V,
                        selectfiles: p,
                        unselectfiles: h
                    }[e.type],
                        a = e.data.files || [],
                        o = a.length,
                        r = e.data.helper || st();
                    if (0 < o && (t = We.parents(a[0])), n !== p && n !== h || (i = n === p, st.each(a, function (e, t) {
                        var n = F.hasClass("elfinder-cwd-allselected");
                        z[t] ? (n && (k && P.children("input").prop("checked", !1), F.removeClass("elfinder-cwd-allselected"), n = !1), i || delete z[t]) : i && (z[t] = !0)
                    })), !r.data("locked")) {
                        for (; o--;) try {
                            We.cwdHash2Elm(a[o]).trigger(n)
                        } catch (e) { }
                        e.data.inselect || A()
                    }
                    U.data("dropover") && -1 !== t.indexOf(U.data("dropover")) && (t = "lockfiles" !== e.type, r.toggleClass("elfinder-drag-helper-plus", t), U.toggleClass(c, t))
                }).bind("mkdir mkfile duplicate upload rename archive extract paste multiupload", function (e) {
                    var n;
                    "upload" == e.type && e.data._multiupload || (n = We.cwd().hash, T({
                        notrigger: !0
                    }), st.each((e.data.added || []).concat(e.data.changed || []), function (e, t) {
                        t && t.phash == n && H(t.hash)
                    }), A())
                }).shortcut({
                    pattern: "ctrl+a",
                    description: "selectall",
                    callback: he
                }).shortcut({
                    pattern: "ctrl+shift+i",
                    description: "selectinvert",
                    callback: function () {
                        var i = {};
                        ue ? T() : Object.keys(z).length ? (st.each(r || d, function (e, t) {
                            var n = We.cwdHash2Elm(t);
                            z[t] ? n.length && n.trigger(h) : (i[t] = !0, n.length && n.trigger(p))
                        }), z = i, A()) : he()
                    }
                }).shortcut({
                    pattern: "left right up down shift+left shift+right shift+up shift+down",
                    description: "selectfiles",
                    type: "keydown",
                    callback: function (e) {
                        var t, n, i, a, o, r = e.keyCode,
                            e = e.shiftKey,
                            s = st.ui.keyCode,
                            l = r == s.LEFT || r == s.UP,
                            c = F.find("[id]." + f);

                        function d(e, t) {
                            return e[t + "All"]("[id]:not(." + m + "):not(.elfinder-cwd-parent):first")
                        }
                        if (c.length)
                            if ((i = d(t = c.filter(l ? ":first" : ":last"), l ? "prev" : "next")).length)
                                if (v || r == s.LEFT || r == s.RIGHT) n = i;
                                else if (a = t.position().top, o = t.position().left, n = t, l) {
                                    for (;
                                        (n = n.prev("[id]")).length && !(n.position().top < a && n.position().left <= o););
                                    n.hasClass(m) && (n = d(n, "next"))
                                } else {
                                    for (;
                                        (n = n.next("[id]")).length && !(n.position().top > a && n.position().left >= o););
                                    (n = n.hasClass(m) ? d(n, "prev") : n).length || (i = F.find("[id]:not(." + m + "):last")).position().top > a && (n = i)
                                } else n = t;
                        else n = de.length ? l ? de.prev() : de : F.find("[id]:not(." + m + "):not(.elfinder-cwd-parent):" + (l ? "last" : "first"));
                        n && n.length && !n.hasClass("elfinder-cwd-parent") && (t && e ? n = t.add(t[l ? "prevUntil" : "nextUntil"]("#" + n.attr("id"))).add(n) : c.trigger(h), n.trigger(p), me(n.filter(l ? ":first" : ":last")), A())
                    }
                }).shortcut({
                    pattern: "home",
                    description: "selectffile",
                    callback: function (e) {
                        T({
                            notrigger: !0
                        }), me(F.find("[id]:first").trigger(p)), A()
                    }
                }).shortcut({
                    pattern: "end",
                    description: "selectlfile",
                    callback: function (e) {
                        T({
                            notrigger: !0
                        }), me(F.find("[id]:last").trigger(p)), A()
                    }
                }).shortcut({
                    pattern: "page_up",
                    description: "pageTurning",
                    callback: function (e) {
                        S.itemH && U.scrollTop(Math.round(U.scrollTop() - Math.floor((U.height() + (v ? -1 * S.itemH : 16)) / S.itemH) * S.itemH))
                    }
                }).shortcut({
                    pattern: "page_down",
                    description: "pageTurning",
                    callback: function (e) {
                        S.itemH && U.scrollTop(Math.round(U.scrollTop() + Math.floor((U.height() + (v ? -1 * S.itemH : 16)) / S.itemH) * S.itemH))
                    }
                })
            }), this
        }, st.fn.elfinderdialog = function (C, z) {
            function T(e) {
                var t = e.data;
                n && cancelAnimationFrame(n), n = requestAnimationFrame(function () {
                    E.enabled && D(t)
                })
            }

            function A() {
                var e = S.children(".elfinder-dialog." + z.res("class", "editing") + ":visible");
                z[e.length ? "disable" : "enable"]()
            }
            var j, n, e, S, O, I = -1 != window.navigator.platform.indexOf("Win"),
                M = {},
                E = {
                    enabled: !1,
                    width: !1,
                    height: !1,
                    defaultSize: null
                },
                D = function (e) {
                    var t;
                    E.enabled && (t = z.options.dialogContained ? S : st(window), t = {
                        maxWidth: E.width ? t.width() - M.width : null,
                        maxHeight: E.height ? t.height() - M.height : null
                    }, Object.assign(O, t), e.css(t).trigger("resize"), e.data("hasResizable") && (e.resizable("option", "maxWidth") < t.maxWidth || e.resizable("option", "maxHeight") < t.maxHeight) && e.resizable("option", t))
                };
            return z && z.ui ? S = z.getUI() : (S = this.closest(".elfinder"), z = z || S.elfinder("instance")), "string" == typeof C ? (e = this.closest(".ui-dialog")).length && ("open" === C ? "none" === e.css("display") && (e.trigger("posinit").show().trigger("open").hide(), e.fadeIn(120, function () {
                z.trigger("dialogopened", {
                    dialog: e
                })
            })) : "close" === C || "destroy" === C ? (e.stop(!0), (e.is(":visible") || S.is(":hidden")) && (e.trigger("close"), z.trigger("dialogclosed", {
                dialog: e
            })), "destroy" === C ? (e.remove(), z.trigger("dialogremoved", {
                dialog: e
            })) : e.data("minimized") && e.data("minimized").close()) : "toTop" === C ? (e.trigger("totop"), z.trigger("dialogtotoped", {
                dialog: e
            })) : "posInit" === C ? (e.trigger("posinit"), z.trigger("dialogposinited", {
                dialog: e
            })) : "tabstopsInit" === C ? (e.trigger("tabstopsInit"), z.trigger("dialogtabstopsinited", {
                dialog: e
            })) : "checkEditing" === C && A()) : ((C = Object.assign({}, st.fn.elfinderdialog.defaults, C)).allowMinimize && "auto" === C.allowMinimize && (C.allowMinimize = !!this.find("textarea,input").length), C.openMaximized = C.allowMinimize && C.openMaximized, C.headerBtnPos && "auto" === C.headerBtnPos && (C.headerBtnPos = I ? "right" : "left"), C.headerBtnOrder && "auto" === C.headerBtnOrder && (C.headerBtnOrder = I ? "close:maximize:minimize" : "close:minimize:maximize"), C.modal && C.allowMinimize && (C.allowMinimize = !1), z.options.dialogContained ? E.width = E.height = E.enabled = !0 : (E.width = "window" === C.maxWidth, E.height = "window" === C.maxHeight, (E.width || E.height) && (E.enabled = !0)), j = z.arrayFlip(C.propagationEvents, !0), this.filter(":not(.ui-dialog-content)").each(function () {
                function e() {
                    (v = x.find("." + s)).length && (v.attr("tabindex", "-1"), v.filter("." + l).length || h.children("." + s + ":" + (I ? "first" : "last")).addClass(l))
                }
                var t, n, c = st(this).addClass("ui-dialog-content ui-widget-content"),
                    i = "elfinder-dialog-active",
                    a = "elfinder-dialog",
                    o = "elfinder-dialog-notify",
                    r = "ui-state-hover",
                    s = "elfinder-tabstop",
                    l = "elfinder-focus",
                    d = "elfinder-dialog-modal",
                    p = parseInt(1e6 * Math.random()),
                    u = st('<div class="ui-dialog-titlebar ui-widget-header ui-corner-top ui-helper-clearfix"><span class="elfinder-dialog-title">' + C.title + "</span></div>"),
                    h = st('<div class="ui-dialog-buttonset"></div>'),
                    f = st('<div class=" ui-helper-clearfix ui-dialog-buttonpane ui-widget-content"></div>').append(h),
                    m = 0,
                    g = 0,
                    v = st(),
                    b = st('<div style="width:100%;height:100%;position:absolute;top:0px;left:0px;"></div>').hide(),
                    y = function (n) {
                        var i = v.filter(":visible:enabled"),
                            a = n ? null : i.filter("." + l + ":first");
                        return a && a.length || (a = i.first()), n && st.each(i, function (e, t) {
                            if (t === n && i[e + 1]) return a = i.eq(e + 1), !1
                        }), a
                    },
                    w = {
                        close: function () {
                            u.prepend(st('<span class="ui-widget-header ui-dialog-titlebar-close ui-corner-all elfinder-titlebar-button"><span class="ui-icon ui-icon-closethick"></span></span>').on("mousedown touchstart", function (e) {
                                e.preventDefault(), e.stopPropagation(), c.elfinderdialog("close")
                            }))
                        },
                        maximize: function () {
                            C.allowMaximize && (x.on("resize", function (e, t) {
                                var n;
                                if (e.preventDefault(), e.stopPropagation(), t && t.maximize) {
                                    if (n = u.find(".elfinder-titlebar-full"), t = "on" === t.maximize, n.children("span.ui-icon").toggleClass("ui-icon-plusthick", !t).toggleClass("ui-icon-arrowreturnthick-1-s", t), t) {
                                        try {
                                            x.hasClass("ui-draggable") && x.draggable("disable"), x.hasClass("ui-resizable") && x.resizable("disable")
                                        } catch (e) { }
                                        c.css("width", "100%").css("height", x.height() - x.children(".ui-dialog-titlebar").outerHeight(!0) - f.outerHeight(!0))
                                    } else {
                                        c.attr("style", n.data("style")), n.removeData("style"), k();
                                        try {
                                            x.hasClass("ui-draggable") && x.draggable("enable"), x.hasClass("ui-resizable") && x.resizable("enable")
                                        } catch (e) { }
                                    }
                                    x.trigger("resize", {
                                        init: !0
                                    })
                                }
                            }), u.prepend(st('<span class="ui-widget-header ui-corner-all elfinder-titlebar-button elfinder-titlebar-full"><span class="ui-icon ui-icon-plusthick"></span></span>').on("mousedown touchstart", function (e) {
                                var t = st(this);
                                e.preventDefault(), e.stopPropagation(), x.hasClass("elfinder-maximized") || void 0 !== t.data("style") || (c.height(c.height()), t.data("style", c.attr("style") || "")), z.toggleMaximize(x), "function" == typeof C.maximize && C.maximize.call(c[0])
                            })))
                        },
                        minimize: function () {
                            var e, s, l;
                            C.allowMinimize && (e = st('<span class="ui-widget-header ui-corner-all elfinder-titlebar-button elfinder-titlebar-minimize"><span class="ui-icon ui-icon-minusthick"></span></span>').on("mousedown touchstart", function (e) {
                                function t() {
                                    s.remove(), x.removeData("minimized").show(), c.elfinderdialog("close")
                                }
                                var n = st(this),
                                    i = z.getUI("bottomtray"),
                                    a = {
                                        width: 70,
                                        height: 24
                                    },
                                    o = st("<div></div>").css(a).addClass(x.get(0).className + " elfinder-dialog-minimized"),
                                    r = {};
                                e.preventDefault(), e.stopPropagation(), x.data("minimized") ? (x.removeData("minimized").before(s.css(Object.assign({
                                    position: "absolute"
                                }, s.offset()))), z.toFront(s), s.animate(Object.assign({
                                    width: x.width(),
                                    height: x.height()
                                }, l), function () {
                                    x.show(), z.toFront(x), s.remove(), k(), A(), x.trigger("resize", {
                                        init: !0
                                    }), "function" == typeof C.minimize && C.minimize.call(c[0])
                                })) : (l = x.data("minimized", {
                                    dialog: function () {
                                        return s
                                    },
                                    show: function () {
                                        s.show()
                                    },
                                    hide: function () {
                                        s.hide()
                                    },
                                    close: t,
                                    title: function (e) {
                                        s.children(".ui-dialog-titlebar").children(".elfinder-dialog-title").text(e)
                                    }
                                }).position(), s = x.clone().on("mousedown", function () {
                                    n.trigger("mousedown")
                                }).removeClass("ui-draggable ui-resizable elfinder-frontmost"), i.append(o), Object.assign(r, o.offset(), a), o.remove(), s.height(x.height()).children(".ui-dialog-content:first").empty(), z.toHide(x.before(s)), s.children(".ui-dialog-content:first,.ui-dialog-buttonpane,.ui-resizable-handle").remove(), s.find(".elfinder-titlebar-minimize,.elfinder-titlebar-full").remove(), s.find(".ui-dialog-titlebar-close").on("mousedown", function (e) {
                                    e.stopPropagation(), e.preventDefault(), t()
                                }), s.animate(r, function () {
                                    s.attr("style", "").css({
                                        maxWidth: x.width()
                                    }).addClass("elfinder-dialog-minimized").appendTo(i), A(), "function" == typeof C.minimize && C.minimize.call(c[0])
                                }))
                            }), u.on("dblclick", function (e) {
                                st(this).children(".elfinder-titlebar-minimize").trigger("mousedown")
                            }).prepend(e), x.on("togleminimize", function () {
                                e.trigger("mousedown")
                            }))
                        }
                    },
                    x = st('<div class="ui-front ui-dialog ui-widget ui-widget-content ui-corner-all ui-draggable std42-dialog touch-punch ' + a + " " + C.cssClass + '"></div>').hide().append(c).appendTo(S).draggable({
                        containment: z.options.dialogContained ? S : null,
                        handle: ".ui-dialog-titlebar",
                        start: function () {
                            b.show()
                        },
                        drag: function (e, t) {
                            var n = t.offset.top,
                                i = t.offset.left;
                            n < 0 && (t.position.top = t.position.top - n), i < 0 && (t.position.left = t.position.left - i), z.options.dialogContained && (t.position.top < 0 && (t.position.top = 0), t.position.left < 0 && (t.position.left = 0))
                        },
                        stop: function (e, t) {
                            b.hide(), x.css({
                                height: C.height
                            }), c.data("draged", !0)
                        }
                    }).css({
                        width: C.width,
                        height: C.height,
                        minWidth: C.minWidth,
                        minHeight: C.minHeight,
                        maxWidth: C.maxWidth,
                        maxHeight: C.maxHeight
                    }).on("touchstart touchmove touchend click dblclick mouseup mouseenter mouseleave mouseout mouseover mousemove", function (e) {
                        j[e.type] || e.stopPropagation()
                    }).on("mousedown", function (e) {
                        j[e.type] || e.stopPropagation(), requestAnimationFrame(function () {
                            x.is(":visible") && !x.hasClass("elfinder-frontmost") && ((n = st(":focus")).length || (n = void 0), x.trigger("totop"))
                        })
                    }).on("open", function () {
                        x.data("margin-y", c.outerHeight(!0) - c.height()), E.enabled && (C.height && "auto" !== C.height && x.trigger("resize", {
                            init: !0
                        }), E.defaultSize || (E.defaultSize = {
                            width: c.width(),
                            height: c.height()
                        }), D(x), x.trigger("resize").trigger("posinit"), S.on("resize." + z.namespace, x, T)), x.hasClass(o) || S.children("." + a + ":visible:not(." + o + ")").each(function () {
                            var e = st(this),
                                t = parseInt(e.css("top")),
                                n = parseInt(e.css("left")),
                                i = parseInt(x.css("top")),
                                a = parseInt(x.css("left")),
                                o = Math.abs(t - i) < 10,
                                r = Math.abs(n - a) < 10;
                            e[0] != x[0] && (o || r) && x.css({
                                top: o ? t + 10 : i,
                                left: r ? n + 10 : a
                            })
                        }), x.data("modal") && (x.addClass(d), z.getUI("overlay").elfinderoverlay("show")), x.trigger("totop"), C.openMaximized && z.toggleMaximize(x), z.trigger("dialogopen", {
                            dialog: x
                        }), "function" == typeof C.open && st.proxy(C.open, c[0])(), C.closeOnEscape && st(document).on("keydown." + p, function (e) {
                            e.keyCode == st.ui.keyCode.ESCAPE && x.hasClass("elfinder-frontmost") && c.elfinderdialog("close")
                        }), x.hasClass(z.res("class", "editing")) && A()
                    }).on("close", function (e) {
                        var t;
                        C.beforeclose && "function" == typeof C.beforeclose ? (t = C.beforeclose()) && t.promise || (t = t ? st.Deferred().resolve() : st.Deferred().reject()) : t = st.Deferred().resolve(), t.done(function () {
                            E.enabled && S.off("resize." + z.namespace, T), C.closeOnEscape && st(document).off("keyup." + p), C.allowMaximize && z.toggleMaximize(x, !1), z.toHide(x), x.data("modal") && z.getUI("overlay").elfinderoverlay("hide"), "function" == typeof C.close && st.proxy(C.close, c[0])(), C.destroyOnClose && x.parent().length && x.hide().remove(), S.children("." + a + ":visible"), x.hasClass(z.res("class", "editing")) && A()
                        })
                    }).on("totop frontmost", function () {
                        var e = z.storage("autoFocusDialog");
                        x.data("focusOnMouseOver", e ? 0 < e : z.options.uiOptions.dialog.focusOnMouseOver), x.data("minimized") && u.children(".elfinder-titlebar-minimize").trigger("mousedown"), !x.data("modal") && z.getUI("overlay").is(":visible") ? z.getUI("overlay").before(x) : z.toFront(x), S.children("." + a + ":not(." + d + ")").removeClass(i), x.addClass(i), z.UA.Mobile || (n || y()).trigger("focus"), n = void 0
                    }).on("posinit", function () {
                        var e, t, n, i, a, o = C.position;
                        if (!x.hasClass("elfinder-maximized")) {
                            if (!o && !x.data("resizing")) {
                                if (a = S.hasClass("elfinder-fullscreen") || z.options.enableAlways, x.css(a ? {
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    overflow: "auto"
                                } : O), z.UA.Mobile && !a && x.data("rotated") === z.UA.Rotated) return;
                                x.data("rotated", z.UA.Rotated), i = st(window), e = S.offset(), (n = {
                                    width: x.outerWidth(!0),
                                    height: x.outerHeight(!0)
                                }).right = e.left + n.width, n.bottom = e.top + n.height, (i = {
                                    scrLeft: i.scrollLeft(),
                                    scrTop: i.scrollTop(),
                                    width: i.width(),
                                    height: i.height()
                                }).right = i.scrLeft + i.width, i.bottom = i.scrTop + i.height, a = z.options.dialogContained || a ? t = 0 : (t = -1 * e.top + i.scrTop, -1 * e.left + i.scrLeft), o = {
                                    top: n.height >= i.height ? t : Math.max(t, parseInt((S.height() - n.height) / 2 - 42)),
                                    left: n.width >= i.width ? a : Math.max(a, parseInt((S.width() - n.width) / 2))
                                }, n.right + o.left > i.right && (o.left = Math.max(a, i.right - n.right)), n.bottom + o.top > i.bottom && (o.top = Math.max(t, i.bottom - n.bottom))
                            }
                            C.absolute && (o.position = "absolute"), o && x.css(o)
                        }
                    }).on("resize", function (e, t) {
                        var n, i, a, o, r = 0,
                            s = t && t.init;
                        t && (t.minimize || t.maxmize) || x.data("minimized") || (e.stopPropagation(), e.preventDefault(), x.children(".ui-widget-header,.ui-dialog-buttonpane").each(function () {
                            r += st(this).outerHeight(!0)
                        }), (o = "auto" === C.height) && c.css({
                            "max-height": "",
                            height: "auto"
                        }), n = s || !E.enabled || e.originalEvent || x.hasClass("elfinder-maximized") ? x.height() - r - x.data("margin-y") : (n = x.height(), i = x.css("min-height") || n, a = x.css("max-height") || n, i = i.match(/%/) ? Math.floor(parseInt(i) / 100 * x.parent().height()) : parseInt(i), a = a.match(/%/) ? Math.floor(parseInt(a) / 100 * x.parent().height()) : parseInt(a), Math.min(o ? x.height() : E.defaultSize.height, Math.max(a, i) - r - x.data("margin-y"))), c.css(o ? "max-height" : "height", n), s || (k(), i = n < (i = c.height()) ? i + r + x.data("margin-y") : C.minHeight, x.css("min-height", i), x.data("hasResizable") && x.resizable("option", {
                            minHeight: i
                        }), "function" == typeof C.resize && st.proxy(C.resize, c[0])(e, t)))
                    }).on("tabstopsInit", e).on("focus", "." + s, function () {
                        st(this).addClass(r).parent("label").addClass(r), this.id && st(this).parent().find("label[for=" + this.id + "]").addClass(r)
                    }).on("click", "select." + s, function () {
                        var e = st(this);
                        e.data("keepFocus") ? e.removeData("keepFocus") : e.data("keepFocus", !0)
                    }).on("blur", "." + s, function () {
                        st(this).removeClass(r).removeData("keepFocus").parent("label").removeClass(r), this.id && st(this).parent().find("label[for=" + this.id + "]").removeClass(r)
                    }).on("mouseenter mouseleave", "." + s + ",label", function (e) {
                        var t, n = st(this);
                        ("LABEL" !== this.nodeName || n.children("." + s).length || (t = n.attr("for")) && st("#" + t).hasClass(s)) && (C.btnHoverFocus && x.data("focusOnMouseOver") ? "mouseenter" !== e.type || st(":focus").data("keepFocus") || n.trigger("focus") : n.toggleClass(r, "mouseenter" == e.type))
                    }).on("keydown", "." + s, function (e) {
                        var t, n, i = st(this);
                        i.is(":focus") && (t = e.keyCode === st.ui.keyCode.ESCAPE, e.keyCode === st.ui.keyCode.ENTER ? (e.preventDefault(), i.trigger("click")) : e.keyCode === st.ui.keyCode.TAB && e.shiftKey || e.keyCode === st.ui.keyCode.LEFT || e.keyCode == st.ui.keyCode.UP ? n = "prev" : e.keyCode !== st.ui.keyCode.TAB && e.keyCode != st.ui.keyCode.RIGHT && e.keyCode != st.ui.keyCode.DOWN || (n = "next"), n && (i.is("textarea") && !e.ctrlKey && !e.metaKey || i.is("select,span.ui-slider-handle") && e.keyCode !== st.ui.keyCode.TAB || i.is("input:not(:checkbox,:radio)") && !e.ctrlKey && !e.metaKey && e.keyCode === st.ui.keyCode["prev" === n ? "LEFT" : "RIGHT"]) ? e.stopPropagation() : (t ? i.is("input:not(:checkbox,:radio),textarea") && "" !== i.val() && (i.val(""), e.stopPropagation()) : e.stopPropagation(), n && (e.preventDefault(), ("prev" === n ? function (n) {
                            var i = v.filter(":visible:enabled"),
                                a = i.last();
                            return st.each(i, function (e, t) {
                                if (t === n && i[e - 1]) return a = i.eq(e - 1), !1
                            }), a
                        } : y)(this).trigger("focus"))))
                    }).data({
                        modal: C.modal
                    }),
                    k = function () {
                        var e, t = z.getUI();
                        t.hasClass("elfinder-fullscreen") && (e = x.position(), x.css("top", Math.max(Math.min(Math.max(e.top, 0), t.height() - 100), 0)), x.css("left", Math.max(Math.min(Math.max(e.left, 0), t.width() - 200), 0)))
                    };
                x.prepend(u), st.each(C.headerBtnOrder.split(":").reverse(), function (e, t) {
                    w[t] && w[t]()
                }), I && u.children(".elfinder-titlebar-button").addClass("elfinder-titlebar-button-right"), st.each(C.buttons, function (e, t) {
                    e = st('<button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only elfinder-btncnt-' + g++ + " " + s + '"><span class="ui-button-text">' + e + "</span></button>").on("click", st.proxy(t, c[0]));
                    t._cssClass && e.addClass(t._cssClass), I ? h.append(e) : h.prepend(e)
                }), h.children().length && (x.append(f), x.show(), f.find("button").each(function (e, t) {
                    m += st(t).outerWidth(!0)
                }), x.hide(), m += 20, x.width() < m && x.width(m)), x.append(b), E.enabled && (M.width = x.outerWidth(!0) - x.width() + (x.outerWidth() - x.width()) / 2, M.height = x.outerHeight(!0) - x.height() + (x.outerHeight() - x.height()) / 2), z.options.dialogContained && (t = {
                    maxWidth: S.width() - M.width,
                    maxHeight: S.height() - M.height
                }, C.maxWidth = C.maxWidth ? Math.min(t.maxWidth, C.maxWidth) : t.maxWidth, C.maxHeight = C.maxHeight ? Math.min(t.maxHeight, C.maxHeight) : t.maxHeight, x.css(t)), O = {
                    maxWidth: x.css("max-width"),
                    maxHeight: x.css("max-height"),
                    overflow: x.css("overflow")
                }, C.resizable && x.resizable({
                    minWidth: C.minWidth,
                    minHeight: C.minHeight,
                    maxWidth: C.maxWidth,
                    maxHeight: C.maxHeight,
                    start: function () {
                        b.show(), !0 !== x.data("resizing") && x.data("resizing") && clearTimeout(x.data("resizing")), x.data("resizing", !0)
                    },
                    stop: function (e, t) {
                        b.hide(), x.data("resizing", setTimeout(function () {
                            x.data("resizing", !1)
                        }, 200)), E.enabled && (E.defaultSize = {
                            width: c.width(),
                            height: c.height()
                        })
                    }
                }).data("hasResizable", !0), C.optimizeNumber && x.find("input[type=number]").each(function () {
                    st(this).attr("inputmode", "numeric"), st(this).attr("pattern", "[0-9]*")
                }), e(), "function" == typeof C.create && st.proxy(C.create, this)(), C.autoOpen && (C.open ? requestAnimationFrame(function () {
                    c.elfinderdialog("open")
                }) : c.elfinderdialog("open")), C.resize && z.bind("themechange", function () {
                    setTimeout(function () {
                        x.data("margin-y", c.outerHeight(!0) - c.height()), x.trigger("resize", {
                            init: !0
                        })
                    }, 300)
                })
            })), this
        }, st.fn.elfinderdialog.defaults = {
            cssClass: "",
            title: "",
            modal: !1,
            resizable: !0,
            autoOpen: !0,
            closeOnEscape: !0,
            destroyOnClose: !1,
            buttons: {},
            btnHoverFocus: !0,
            position: null,
            absolute: !1,
            width: 320,
            height: "auto",
            minWidth: 200,
            minHeight: 70,
            maxWidth: null,
            maxHeight: null,
            allowMinimize: "auto",
            allowMaximize: !1,
            openMaximized: !1,
            headerBtnPos: "auto",
            headerBtnOrder: "auto",
            optimizeNumber: !0,
            propagationEvents: ["mousemove", "mouseup"]
        }, st.fn.elfinderfullscreenbutton = function (n) {
            return this.each(function () {
                var e, t = st(this).elfinderbutton(n).children(".elfinder-button-icon");
                n.change(function () {
                    e && cancelAnimationFrame(e), e = requestAnimationFrame(function () {
                        var e = n.value;
                        t.addClass("elfinder-button-icon-fullscreen").toggleClass("elfinder-button-icon-unfullscreen", e), n.className = e ? "unfullscreen" : ""
                    })
                })
            })
        }, st.fn.elfindernavbar = function (h, e) {
            return this.not(".elfinder-navbar").each(function () {
                function a() {
                    var e = h.getUI("cwd"),
                        t = h.getUI("workzone"),
                        n = t.data("rectangle"),
                        i = e.offset();
                    t.data("rectangle", Object.assign(n, {
                        cwdEdge: "ltr" === h.direction ? i.left : i.left + e.width()
                    }))
                }

                function t() {
                    d.css("overflow", "hidden"), n = Math.round(d.outerHeight() - d.height()), i = Math.round(c.outerWidth() - c.innerWidth()), d.css("overflow", "auto")
                }
                var n, i, o, r, s, l, c, d = st(this).hide().addClass("ui-state-default elfinder-navbar"),
                    p = d.css("overflow", "hidden").parent().children(".elfinder-workzone").append(d),
                    u = "ltr" == h.direction;
                h.one("init", function () {
                    c = h.getUI("navdock");

                    function e() {
                        t(), h.bind("wzresize", function () {
                            var e = 0;
                            c.width(d.outerWidth() - i), 1 < c.children().length && (e = c.outerHeight(!0)), d.height(p.height() - e - n)
                        }).trigger("wzresize")
                    }
                    h.cssloaded ? e() : h.one("cssloaded", e)
                }).one("opendone", function () {
                    o && o.trigger("resize"), d.css("overflow", "auto")
                }).bind("themechange", t), h.UA.Touch && (void 0 === (s = h.storage("autoHide") || {}).navbar && (s.navbar = e.autoHideUA && 0 < e.autoHideUA.length && st.grep(e.autoHideUA, function (e) {
                    return !!h.UA[e]
                }).length, h.storage("autoHide", s)), s.navbar && h.one("init", function () {
                    d.children().length && h.uiAutoHide.push(function () {
                        d.stop(!0, !0).trigger("navhide", {
                            duration: "slow",
                            init: !0
                        })
                    })
                }), h.bind("load", function () {
                    d.children().length && "none" !== (r = st('<div class="elfinder-navbar-swipe-handle"></div>').hide().appendTo(p)).css("pointer-events") && (r.remove(), r = null)
                }), d.on("navshow navhide", function (e, t) {
                    var n = "navshow" === e.type ? "show" : "hide",
                        e = t && t.duration ? t.duration : "fast",
                        i = t && t.handleW ? t.handleW : Math.max(50, h.getUI().width() / 10);
                    d.stop(!0, !0)[n]({
                        duration: e,
                        step: function () {
                            h.trigger("wzresize")
                        },
                        complete: function () {
                            r && ("show" == n ? r.stop(!0, !0).hide() : (r.width(i || ""), h.resources.blink(r, "slowonce"))), h.trigger("navbar" + n), t.init && h.trigger("uiautohide"), a()
                        }
                    }), s.navbar = "show" != n, h.storage("autoHide", Object.assign(h.storage("autoHide"), {
                        navbar: s.navbar
                    }))
                }).on("touchstart", function (e) {
                    5 < st(this)["scroll" + ("ltr" === h.direction ? "Right" : "Left")]() && (e.originalEvent._preventSwipeX = !0)
                })), h.UA.Mobile || (o = d.resizable({
                    handles: u ? "e" : "w",
                    minWidth: e.minWidth || 150,
                    maxWidth: e.maxWidth || 500,
                    resize: function () {
                        h.trigger("wzresize")
                    },
                    stop: function (e, t) {
                        h.storage("navbarWidth", t.size.width), a()
                    }
                }).on("resize scroll", function (t) {
                    var e = st(this),
                        n = e.data("posinit");
                    t.preventDefault(), t.stopPropagation(), u || "resize" !== t.type || d.css("left", 0), n && cancelAnimationFrame(n), e.data("posinit", requestAnimationFrame(function () {
                        var e = h.UA.Opera && d.scrollLeft() ? 20 : 2;
                        o.css("top", 0).css({
                            top: parseInt(d.scrollTop()) + "px",
                            left: u ? "auto" : -1 * parseInt(d.scrollRight() - e),
                            right: u ? -1 * parseInt(d.scrollLeft() - e) : "auto"
                        }), "resize" === t.type && h.getUI("cwd").trigger("resize")
                    }))
                }).children(".ui-resizable-handle").addClass("ui-front")), (l = h.storage("navbarWidth")) ? d.width(l) : h.UA.Mobile && h.one(h.cssloaded ? "init" : "cssloaded", function () {
                    function e() {
                        l = d.parent().width() / 2, d.data("defWidth") > l ? d.width(l) : d.width(d.data("defWidth")), d.data("width", d.width()), h.trigger("wzresize")
                    }
                    d.data("defWidth", d.width()), st(window).on("resize." + h.namespace, e), e()
                })
            }), this
        }, st.fn.elfindernavdock = function (h, e) {
            return this.not(".elfinder-navdock").each(function () {
                function o(e, t) {
                    var t = e - (t || l.height()),
                        n = Object.keys(d).length,
                        i = n ? t / n : 0;
                    t && (n = l.css("overflow"), l.css("overflow", "hidden"), l.height(e), st.each(d, function (e, t) {
                        t.height(t.height() + i).trigger("resize." + h.namespace)
                    }), h.trigger("wzresize"), l.css("overflow", n))
                }
                var r, s, l = st(this).hide().addClass("ui-state-default elfinder-navdock touch-punch"),
                    c = (l.parent().children(".elfinder-workzone").append(l), st('<div class="ui-front ui-resizable-handle ui-resizable-n"></div>').appendTo(l)),
                    d = {},
                    p = (parseInt(e.initMaxHeight) || 50) / 100,
                    u = (parseInt(e.maxHeight) || 90) / 100;
                l.data("addNode", function (e, t) {
                    var n, i = h.getUI("workzone").height(),
                        a = i * p;
                    return t = Object.assign({
                        first: !1,
                        sizeSync: !0,
                        init: !1
                    }, t), e.attr("id") || e.attr("id", h.namespace + "-navdock-" + +new Date), t.sizeSync && (d[e.attr("id")] = e), n = l.height() + e.outerHeight(!0), t.first ? c.after(e) : l.append(e), s = !0, l.resizable("enable").height(n).show(), h.trigger("wzresize"), t.init && (e = h.storage("navdockHeight"), r = n = e || (a < n ? a : n)), o(Math.min(n, i * u)), l
                }).data("removeNode", function (e, t) {
                    var n = st("#" + e);
                    return delete d[e], l.height(l.height() - st("#" + e).outerHeight(!0)), t ? "detach" === t ? n = n.detach() : t.append(n) : n.remove(), l.children().length <= 1 && (s = !1, l.resizable("disable").height(0).hide()), h.trigger("wzresize"), n
                }), e.disabled || h.one("init", function () {
                    var n;
                    h.getUI("navbar").children().not(".ui-resizable-handle").length && (l.data("dockEnabled", !0), l.resizable({
                        maxHeight: h.getUI("workzone").height() * u,
                        handles: {
                            n: c
                        },
                        start: function (e, t) {
                            n = l.css("overflow"), l.css("overflow", "hidden"), h.trigger("navdockresizestart", {
                                event: e,
                                ui: t
                            }, !0)
                        },
                        resize: function (e, t) {
                            l.css("top", ""), h.trigger("wzresize", {
                                inNavdockResize: !0
                            })
                        },
                        stop: function (e, t) {
                            h.trigger("navdockresizestop", {
                                event: e,
                                ui: t
                            }, !0), l.css("top", ""), r = t.size.height, h.storage("navdockHeight", r), o(r, t.originalSize.height), l.css("overflow", n)
                        }
                    }), h.bind("wzresize", function (e) {
                        var t;
                        l.is(":visible") && (t = h.getUI("workzone").height() * u, e.data && e.data.inNavdockResize || (e = l.height(), t < r ? 1 < Math.abs(e - t) && o(t) : 1 < Math.abs(e - r) && o(r)), l.resizable("option", "maxHeight", t))
                    }).bind("themechange", function () {
                        var n = Math.round(l.height());
                        requestAnimationFrame(function () {
                            var e = Math.round(l.height()),
                                t = n - e;
                            0 != t && o(l.height(), e - t)
                        })
                    })), h.bind("navbarshow navbarhide", function (e) {
                        l[s && "navbarshow" === e.type ? "show" : "hide"]()
                    })
                })
            }), this
        }, st.fn.elfinderoverlay = function (e) {
            var t, n, i, a = this.parent().elfinder("instance");
            return this.filter(":not(.elfinder-overlay)").each(function () {
                e = Object.assign({}, e), st(this).addClass("ui-front ui-widget-overlay elfinder-overlay").hide().on("mousedown", function (e) {
                    e.preventDefault(), e.stopPropagation()
                }).data({
                    cnt: 0,
                    show: "function" == typeof e.show ? e.show : function () { },
                    hide: "function" == typeof e.hide ? e.hide : function () { }
                })
            }), "show" == e && (n = (t = this.eq(0)).data("cnt") + 1, i = t.data("show"), a.toFront(t), t.data("cnt", n), t.is(":hidden") && (t.show(), i())), "hide" == e && (n = (t = this.eq(0)).data("cnt") - 1, a = t.data("hide"), t.data("cnt", n), n <= 0 && (t.hide(), a())), this
        }, st.fn.elfinderpanel = function (a) {
            return this.each(function () {
                var n = st(this).addClass("elfinder-panel ui-state-default ui-corner-all"),
                    i = "margin-" + ("ltr" == a.direction ? "left" : "right");
                a.one("load", function (e) {
                    var t = a.getUI("navbar");
                    n.css(i, parseInt(t.outerWidth(!0))), t.on("resize", function (e) {
                        e.preventDefault(), e.stopPropagation(), n.is(":visible") && n.css(i, parseInt(t.outerWidth(!0)))
                    })
                })
            })
        }, st.fn.elfinderpath = function (f, m) {
            return this.each(function () {
                function n(a) {
                    var o = [],
                        r = [];
                    return st.each(f.parents(a), function (e, t) {
                        var n = a === t ? "elfinder-path-dir elfinder-path-cwd" : "elfinder-path-dir",
                            i = f.file(t),
                            i = f.escape(i.i18 || i.name);
                        r.push(i), o.push('<span id="' + d + t + '" class="' + n + '" title="' + r.join(f.option("separator")) + '">' + i + "</span>")
                    }), o.join('<span class="elfinder-path-other">' + f.option("separator") + "</span>")
                }

                function t() {
                    var e;
                    u.children("span.elfinder-path-dir").attr("style", ""), e = "ltr" === f.direction ? st("#" + d + f.cwd().hash).prevAll("span.elfinder-path-dir:first") : st(), u.scrollLeft(e.length ? e.position().left : 0)
                }

                function i() {
                    var n, e, i, a;
                    f.UA.CSS.flex || (e = (n = u.children("span.elfinder-path-dir")).length, "workzone" === l || e < 2 ? n.attr("style", "") : (u.width(u.css("max-width")), n.css({
                        maxWidth: 100 / e + "%",
                        display: "inline-block"
                    }), i = u.width() - 9, u.children("span.elfinder-path-other").each(function () {
                        i -= st(this).width()
                    }), a = [], n.each(function (e) {
                        var t = st(this).width();
                        i -= t, t < this.scrollWidth && a.push(e)
                    }), u.width(""), a.length ? (0 < i && (i /= a.length, st.each(a, function (e, t) {
                        t = st(n[t]);
                        t.css("max-width", t.width() + i)
                    })), n.last().attr("style", "")) : n.attr("style", "")))
                }
                var e, a, o = "",
                    r = "",
                    s = [],
                    l = "statusbar",
                    c = f.res("class", "hover"),
                    d = "path" + (Fe.prototype.uniqueid || "") + "-",
                    p = st('<div class="ui-widget-header ui-helper-clearfix elfinder-workzone-path"></div>'),
                    u = st(this).addClass("elfinder-path").html("&nbsp;").on("mousedown", "span.elfinder-path-dir", function (e) {
                        var t = st(this).attr("id").substr(d.length);
                        e.preventDefault(), t != f.cwd().hash && (st(this).addClass(c), o ? f.exec("search", o, {
                            target: t,
                            mime: s.join(" ")
                        }) : f.trigger("select", {
                            selected: [t]
                        }).exec("open", t))
                    }).prependTo(f.getUI("statusbar").show()),
                    h = st('<div class="elfinder-path-roots"></div>').on("click", function (e) {
                        e.stopPropagation(), e.preventDefault();
                        var t = st.map(f.roots, function (e) {
                            return f.file(e)
                        }),
                            n = [];
                        st.each(t, function (e, t) {
                            t.phash || f.root(f.cwd().hash, !0) === t.hash || n.push({
                                label: f.escape(t.i18 || t.name),
                                icon: "home",
                                callback: function () {
                                    f.exec("open", t.hash)
                                },
                                options: {
                                    iconClass: t.csscls || "",
                                    iconImg: t.icon || ""
                                }
                            })
                        }), f.trigger("contextmenu", {
                            raw: n,
                            x: e.pageX,
                            y: e.pageY
                        })
                    }).append('<span class="elfinder-button-icon elfinder-button-icon-menu" ></span>').appendTo(p);
                f.one("init", function () {
                    e = f.getUI("tree").length, a = f.getUI("stat").length, !e && m.toWorkzoneWithoutNavbar && (p.append(u).insertBefore(f.getUI("workzone")), l = "workzone", f.bind("open", t).one("opendone", function () {
                        f.getUI().trigger("resize")
                    }))
                }).bind("open searchend parents", function () {
                    r = o = "", s = [], u.html(n(f.cwd().hash)), 1 < Object.keys(f.roots).length ? (u.css("margin", ""), h.show()) : (u.css("margin", 0), h.hide()), a || i()
                }).bind("searchstart", function (e) {
                    e.data && (o = e.data.query || "", r = e.data.target || "", s = e.data.mimes || [])
                }).bind("search", function (e) {
                    var t = "",
                        t = r ? n(r) : f.i18n("btnAll");
                    u.html('<span class="elfinder-path-other">' + f.i18n("searcresult") + ": </span>" + t), i()
                }).bind("navbarshow navbarhide", function () {
                    var e = f.getUI("workzone");
                    "navbarshow" === this.type ? (f.unbind("open", t), u.prependTo(f.getUI("statusbar")), p.detach(), l = "statusbar") : (p.append(u).insertBefore(e), l = "workzone", t(), f.bind("open", t)), f.trigger("uiresize")
                }).bind("resize uistatchange", i)
            })
        }, st.fn.elfinderplaces = function (S, O) {
            return this.each(function () {
                function t() {
                    var e;
                    m = "places" + (O.suffix || ""), l = {}, "string" == typeof (e = S.storage(m)) ? (e = st.grep(e.split(","), function (e) {
                        return !!e
                    }), st.each(e, function (e, t) {
                        t = t.split("#");
                        l[t[0]] = t[1] || t[0]
                    })) : st.isPlainObject(e) && (l = e), S.trigger("placesload", {
                        dirs: l,
                        storageKey: m
                    }, !0), (e = Object.keys(l)).length && (T.prepend(h), S.request({
                        data: {
                            cmd: "info",
                            targets: e
                        },
                        preventDefault: !0
                    }).done(function (e) {
                        var i = {};
                        e.files && e.files.length && S.cache(e.files), st.each(e.files, function (e, t) {
                            var n = t.hash;
                            i[n] = t
                        }), st.each(l, function (e, t) {
                            k(i[e] || Object.assign({
                                notfound: !0
                            }, t))
                        }), 0 < S.storage("placesState") && T.trigger("click")
                    }).always(function () {
                        h.remove()
                    }))
                }

                function s(e) {
                    var t = null;
                    return l[e] && (delete l[e], (e = y(e)).length && (t = e.text(), e.parent().remove(), e = A.children().length, C.toggle(1 < e), e || (T.removeClass(i), j.removeClass(n), A.slideToggle(!1)))), t
                }

                function r(e, t) {
                    var n = e.hash,
                        t = y(t || n),
                        i = x(e, n);
                    return 0 < t.length && (t.parent().replaceWith(i), l[n] = e, !0)
                }
                var l = {},
                    e = "class",
                    o = S.res(e, "navdir"),
                    i = S.res(e, "navcollapse"),
                    n = S.res(e, "navexpand"),
                    a = S.res(e, "hover"),
                    c = S.res(e, "treeroot"),
                    d = S.res(e, "adroppable"),
                    p = S.res("tpl", "placedir"),
                    u = S.res("tpl", "perms"),
                    h = st(S.res("tpl", "navspinner")),
                    f = O.suffix || "",
                    m = "places" + f,
                    g = null,
                    v = function (e) {
                        return e.substr(6)
                    },
                    b = function (e) {
                        return "place-" + e
                    },
                    y = function (e) {
                        return st(document.getElementById(b(e)))
                    },
                    w = function () {
                        var e = [],
                            n = {};
                        (e = st.map(A.children().find("[id]"), function (e) {
                            return v(e.id)
                        })).length ? st.each(e.reverse(), function (e, t) {
                            n[t] = l[t]
                        }) : n = null, S.storage(m, n)
                    },
                    x = function (e, t) {
                        return st(p.replace(/\{id\}/, b(e ? e.hash : t)).replace(/\{name\}/, S.escape(e ? e.i18 || e.name : t)).replace(/\{cssclass\}/, e ? S.perms2class(e) + (e.notfound ? " elfinder-na" : "") + (e.csscls ? " " + e.csscls : "") : "").replace(/\{permissions\}/, !e || e.read && e.write && !e.notfound ? "" : u).replace(/\{title\}/, e ? ' title="' + S.escape(S.path(e.hash, !0) || e.i18 || e.name) + '"' : "").replace(/\{symlink\}/, "").replace(/\{style\}/, e && e.icon ? S.getIconStyle(e) : ""))
                    },
                    k = function (e) {
                        var t, n;
                        return "directory" === e.mime && (n = e.hash, S.files().hasOwnProperty(n) || S.trigger("tree", {
                            tree: [e]
                        }), t = x(e, n), l[n] = e, A.prepend(t), T.addClass(i), C.toggle(1 < A.children().length), !0)
                    },
                    C = st('<span class="elfinder-button-icon elfinder-button-icon-sort elfinder-places-root-icon" title="' + S.i18n("cmdsort") + '"></span>').hide().on("click", function (e) {
                        e.stopPropagation(), A.empty(), st.each(l, function (e, t) {
                            var n = S.file(e) || t,
                                i = x(n, e),
                                a = null;
                            if (n || i.hide(), A.children().length && (st.each(A.children(), function () {
                                var e = st(this);
                                if ((n.i18 || n.name).localeCompare(e.children("." + o).text()) < 0) return a = !i.insertBefore(e)
                            }), null !== a)) return !0;
                            y(e).length || A.append(i)
                        }), w()
                    }),
                    z = x({
                        hash: "root-" + S.namespace,
                        name: S.i18n(O.name, "places"),
                        read: !0,
                        write: !0
                    }),
                    T = z.children("." + o).addClass(c).on("click", function (e) {
                        e.stopPropagation(), T.hasClass(i) && (j.toggleClass(n), A.slideToggle(), S.storage("placesState", j.hasClass(n) ? 1 : 0))
                    }).append(C),
                    A = z.children("." + S.res(e, "navsubtree")),
                    j = st(this).addClass(S.res(e, "tree") + " elfinder-places ui-corner-all").hide().append(z).appendTo(S.getUI("navbar")).on("mouseenter mouseleave", "." + o, function (e) {
                        st(this).toggleClass("ui-state-hover", "mouseenter" == e.type)
                    }).on("click", "." + o, function (e) {
                        var t = st(this);
                        t.data("longtap") ? e.stopPropagation() : t.hasClass("elfinder-na") || S.exec("open", t.attr("id").substr(6))
                    }).on("contextmenu", "." + o + ":not(." + c + ")", function (e) {
                        var t = st(this),
                            r = t.attr("id").substr(6);
                        e.preventDefault(), S.trigger("contextmenu", {
                            raw: [{
                                label: S.i18n("moveUp"),
                                icon: "up",
                                remain: !0,
                                callback: function () {
                                    var e, t, n, i, a, o;
                                    t = y(e = r), n = t.parent(), i = n.prev("div"), a = "ui-state-hover", o = S.getUI("contextmenu"), g && clearTimeout(g), i.length && (o.find(":first").data("placesHash", e), t.addClass(a), n.insertBefore(i), i = n.prev("div"), g = setTimeout(function () {
                                        t.removeClass(a), o.find(":first").data("placesHash") === e && o.hide().empty()
                                    }, 1500)), i.length || (t.removeClass(a), o.hide().empty()), w()
                                }
                            }, "|", {
                                label: S.i18n("rmFromPlaces"),
                                icon: "rm",
                                callback: function () {
                                    s(r), w()
                                }
                            }],
                            x: e.pageX,
                            y: e.pageY
                        }), t.addClass("ui-state-hover"), S.getUI("contextmenu").children().on("mouseenter", function () {
                            t.addClass("ui-state-hover")
                        }), S.bind("closecontextmenu", function () {
                            t.removeClass("ui-state-hover")
                        })
                    }).droppable({
                        tolerance: "pointer",
                        accept: ".elfinder-cwd-file-wrapper,.elfinder-tree-dir,.elfinder-cwd-file",
                        hoverClass: S.res("class", "adroppable"),
                        classes: {
                            "ui-droppable-hover": S.res("class", "adroppable")
                        },
                        over: function (e, t) {
                            var t = t.helper,
                                n = st.grep(t.data("files"), function (e) {
                                    return "directory" === S.file(e).mime && !l[e]
                                });
                            e.stopPropagation(), t.data("dropover", t.data("dropover") + 1), S.insideWorkzone(e.pageX, e.pageY) && (0 < n.length ? (t.addClass("elfinder-drag-helper-plus"), S.trigger("unlockfiles", {
                                files: t.data("files"),
                                helper: t
                            })) : st(this).removeClass(d))
                        },
                        out: function (e, t) {
                            t = t.helper;
                            e.stopPropagation(), t.removeClass("elfinder-drag-helper-move elfinder-drag-helper-plus").data("dropover", Math.max(t.data("dropover") - 1, 0)), st(this).removeData("dropover").removeClass(d)
                        },
                        drop: function (e, t) {
                            var t = t.helper,
                                n = !0;
                            st.each(t.data("files"), function (e, t) {
                                t = S.file(t);
                                t && "directory" == t.mime && !l[t.hash] ? k(t) : n = !1
                            }), w(), n && t.hide()
                        }
                    }).on("touchstart", "." + o + ":not(." + c + ")", function (e) {
                        var t, n;
                        1 < e.originalEvent.touches.length || (t = st(this).attr("id").substr(6), n = st(this).addClass(a).data("longtap", null).data("tmlongtap", setTimeout(function () {
                            n.data("longtap", !0), S.trigger("contextmenu", {
                                raw: [{
                                    label: S.i18n("rmFromPlaces"),
                                    icon: "rm",
                                    callback: function () {
                                        s(t), w()
                                    }
                                }],
                                x: e.originalEvent.touches[0].pageX,
                                y: e.originalEvent.touches[0].pageY
                            })
                        }, 500)))
                    }).on("touchmove touchend", "." + o + ":not(." + c + ")", function (e) {
                        clearTimeout(st(this).data("tmlongtap")), "touchmove" == e.type && st(this).removeClass(a)
                    });
                st.fn.sortable && A.addClass("touch-punch").sortable({
                    appendTo: S.getUI(),
                    revert: !1,
                    helper: function (e) {
                        e = st(e.target).parent();
                        return e.children().removeClass("ui-state-hover"), st('<div class="ui-widget elfinder-place-drag elfinder-' + S.direction + '"></div>').append(st('<div class="elfinder-navbar"></div>').show().append(e.clone()))
                    },
                    stop: function (e, t) {
                        var t = st(t.item[0]),
                            n = j.offset().top,
                            i = j.offset().left,
                            a = j.width(),
                            o = j.height(),
                            r = e.pageX,
                            e = e.pageY;
                        i < r && r < i + a && n < e && e < e + o || (s(v(t.children(":first").attr("id"))), w())
                    },
                    update: function (e, t) {
                        w()
                    }
                }), st(this).on("regist", function (e, t) {
                    var n = !1;
                    st.each(t, function (e, t) {
                        t && "directory" == t.mime && !l[t.hash] && k(t) && (n = !0)
                    }), n && w()
                }), S.one("load", function () {
                    S.oldAPI || (j.show().parent().show(), t(), S.change(function (e) {
                        var n = !1;
                        st.each(e.data.changed, function (e, t) {
                            l[t.hash] && ("directory" !== t.mime ? s(t.hash) && (n = !0) : r(t) && (n = !0))
                        }), n && w()
                    }).bind("rename", function (n) {
                        var i = !1;
                        n.data.removed && st.each(n.data.removed, function (e, t) {
                            n.data.added[e] && r(n.data.added[e], t) && (i = !0)
                        }), i && w()
                    }).bind("rm paste", function (e) {
                        var n = [],
                            t = !1;
                        e.data.removed && st.each(e.data.removed, function (e, t) {
                            t = s(t);
                            t && n.push(t)
                        }), n.length && (t = !0), e.data.added && n.length && st.each(e.data.added, function (e, t) {
                            1 !== st.inArray(t.name, n) && "directory" == t.mime && k(t)
                        }), t && w()
                    }).bind("sync netmount", function () {
                        var o = this,
                            e = O.suffix || "";
                        if ("sync" === o.type && f !== e) return f = e, A.empty(), T.removeClass(i), j.removeClass(n), A.slideToggle(!1), void t();
                        (e = Object.keys(l)).length && (T.prepend(h), S.request({
                            data: {
                                cmd: "info",
                                targets: e
                            },
                            preventDefault: !0
                        }).done(function (e) {
                            var i = {},
                                n = !1,
                                a = S.cwd().hash;
                            st.each(e.files || [], function (e, t) {
                                var n = t.hash;
                                i[n] = t, S.files().hasOwnProperty(t.hash) || S.updateCache({
                                    tree: [t]
                                })
                            }), st.each(l, function (e, t) {
                                Boolean(t.notfound) === Boolean(i[e]) ? t.phash === a && "netmount" !== o.type || i[e] && "directory" !== i[e].mime ? s(e) && (n = !0) : r(i[e] || Object.assign({
                                    notfound: !0
                                }, t)) && (n = !0) : i[e] && i[e].phash != a && r(i[e])
                            }), n && w()
                        }).always(function () {
                            h.remove()
                        }))
                    }))
                })
            })
        }, st.fn.elfindersearchbutton = function (g) {
            return this.each(function () {
                function t() {
                    m.data("inctm") && clearTimeout(m.data("inctm"));
                    var e = st.trim(m.val()),
                        t = !st("#" + c("SearchFromAll")).prop("checked"),
                        n = st("#" + c("SearchMime")).prop("checked"),
                        i = "",
                        t = t && (st("#" + c("SearchFromVol")).prop("checked") ? s.root(s.cwd().hash) : s.cwd().hash);
                    n && (n = e, e = "."), a && (i = a.children("input:checked").val()), e ? (m.trigger("focus"), g.exec(e, t, n, i).done(function () {
                        r = !0
                    }).fail(function () {
                        h()
                    })) : s.trigger("searchend")
                }
                var n, a, i, o, r = !1,
                    s = g.fm,
                    l = (s.res("class", "disabled"), g.options.incsearch || {
                        enable: !1
                    }),
                    e = g.options.searchTypes,
                    c = function (e) {
                        return s.namespace + s.escape(e)
                    },
                    d = s.getUI("toolbar"),
                    p = s.res("class", "searchbtn"),
                    u = st(this).hide().addClass("ui-widget-content elfinder-button " + p).on("click", function (e) {
                        e.stopPropagation()
                    }),
                    h = function () {
                        m.data("inctm") && clearTimeout(m.data("inctm")), m.val("").trigger("blur"), (r || f) && (r = !1, f = "", s.lazy(function () {
                            s.trigger("searchend")
                        }))
                    },
                    f = "",
                    m = st('<input type="text" size="42"/>').on("focus", function () {
                        var e, t;
                        u.hasClass("ui-state-active") || s.getUI().click(), o = !0, f = "", u.addClass("ui-state-active"), s.trigger("uiresize"), n && n.css((e = s.getUI(), t = e.offset(), {
                            top: u.offset().top - t.top,
                            maxHeight: e.height() - 40
                        })).slideDown(function () {
                            u.addClass("ui-state-active"), s.toFront(n)
                        })
                    }).on("blur", function () {
                        o = !1, n ? n.data("infocus") ? n.data("infocus", !1) : n.slideUp(function () {
                            u.removeClass("ui-state-active"), s.trigger("uiresize"), s.toHide(n)
                        }) : u.removeClass("ui-state-active")
                    }).appendTo(u).on("keypress", function (e) {
                        e.stopPropagation()
                    }).on("keydown", function (e) {
                        e.stopPropagation(), e.keyCode === st.ui.keyCode.ENTER ? t() : e.keyCode === st.ui.keyCode.ESCAPE && (e.preventDefault(), h())
                    });
                l.enable && (l.minlen = l.minlen || 2, l.wait = l.wait || 500, m.attr("title", s.i18n("incSearchOnly")).on("compositionstart", function () {
                    m.data("composing", !0)
                }).on("compositionend", function () {
                    m.removeData("composing"), m.trigger("input")
                }).on("input", function () {
                    m.data("composing") || (m.data("inctm") && clearTimeout(m.data("inctm")), m.data("inctm", setTimeout(function () {
                        var e = m.val();
                        (0 === e.length || e.length >= l.minlen) && (f !== e && s.trigger("incsearchstart", {
                            query: e,
                            type: a ? a.children("input:checked").val() : "searchName"
                        }), "" === (f = e) && 1 < s.searchStatus.state && s.searchStatus.query && m.val(s.searchStatus.query).trigger("select"))
                    }, l.wait)))
                }), s.UA.ltIE8 && m.on("keydown", function (e) {
                    229 === e.keyCode && (m.data("imetm") && clearTimeout(m.data("imetm")), m.data("composing", !0), m.data("imetm", setTimeout(function () {
                        m.removeData("composing")
                    }, 100)))
                }).on("keyup", function (e) {
                    m.data("imetm") && clearTimeout(m.data("imetm")), m.data("composing") ? e.keyCode === st.ui.keyCode.ENTER && m.trigger("compositionend") : m.trigger("input")
                })), st('<span class="ui-icon ui-icon-search" title="' + g.title + '"></span>').appendTo(u).on("mousedown", function (e) {
                    e.stopPropagation(), e.preventDefault(), u.hasClass("ui-state-active") ? t() : m.trigger("focus")
                }), st('<span class="ui-icon ui-icon-close"></span>').appendTo(u).on("mousedown", function (e) {
                    e.stopPropagation(), e.preventDefault(), "" !== m.val() || u.hasClass("ui-state-active") ? h() : m.trigger("focus")
                }), s.bind("toolbarload", function () {
                    var e = u.parent();
                    e.length && (d.prepend(u.show()), e.remove(), s.UA.ltIE7 && (e = u.children("ltr" == s.direction ? ".ui-icon-close" : ".ui-icon-search")).css({
                        right: "",
                        left: parseInt(u.width()) - e.outerWidth(!0)
                    }))
                }), s.one("init", function () {
                    s.getUI("cwd").on("touchstart click", function () {
                        o && m.trigger("blur")
                    })
                }).one("open", function () {
                    (n = s.api < 2.1 ? null : st('<div class="ui-front ui-widget ui-widget-content elfinder-button-menu elfinder-button-search-menu ui-corner-all"></div>').append(st('<div class="buttonset"></div>').append(st('<input id="' + c("SearchFromCwd") + '" name="serchfrom" type="radio" checked="checked"/><label for="' + c("SearchFromCwd") + '">' + s.i18n("btnCwd") + "</label>"), st('<input id="' + c("SearchFromVol") + '" name="serchfrom" type="radio"/><label for="' + c("SearchFromVol") + '">' + s.i18n("btnVolume") + "</label>"), st('<input id="' + c("SearchFromAll") + '" name="serchfrom" type="radio"/><label for="' + c("SearchFromAll") + '">' + s.i18n("btnAll") + "</label>")), st('<div class="buttonset elfinder-search-type"></div>').append(st('<input id="' + c("SearchName") + '" name="serchcol" type="radio" checked="checked" value="SearchName"/><label for="' + c("SearchName") + '">' + s.i18n("btnFileName") + "</label>"))).hide().appendTo(s.getUI())) && (e && (a = n.find(".elfinder-search-type"), st.each(g.options.searchTypes, function (e, t) {
                        a.append(st('<input id="' + c(e) + '" name="serchcol" type="radio" value="' + s.escape(e) + '"/><label for="' + c(e) + '">' + s.i18n(t.name) + "</label>"))
                    })), n.find("div.buttonset").buttonset(), st("#" + c("SearchFromAll")).next("label").attr("title", s.i18n("searchTarget", s.i18n("btnAll"))), e && st.each(e, function (e, t) {
                        t.title && st("#" + c(e)).next("label").attr("title", s.i18n(t.title))
                    }), n.on("mousedown", "div.buttonset", function (e) {
                        e.stopPropagation(), n.data("infocus", !0)
                    }).on("click", "input", function (e) {
                        e.stopPropagation(), st.trim(m.val()) ? t() : m.trigger("focus")
                    }).on("close", function () {
                        m.trigger("blur")
                    }))
                }).bind("searchend", function () {
                    m.val("")
                }).bind("open parents", function () {
                    var n = [],
                        e = s.file(s.root(s.cwd().hash));
                    e && (st.each(s.parents(s.cwd().hash), function (e, t) {
                        n.push(s.file(t).name)
                    }), st("#" + c("SearchFromCwd")).next("label").attr("title", s.i18n("searchTarget", n.join(s.option("separator")))), st("#" + c("SearchFromVol")).next("label").attr("title", s.i18n("searchTarget", e.name)))
                }).bind("open", function () {
                    f && h()
                }).bind("cwdinit", function () {
                    i = !1
                }).bind("cwdrender", function () {
                    i = !0
                }).bind("keydownEsc", function () {
                    f && "/" === f.substr(0, 1) && (f = "", m.val(""), s.trigger("searchend"))
                }).shortcut({
                    pattern: "ctrl+f f3",
                    description: g.title,
                    callback: function () {
                        m.trigger("select").trigger("focus")
                    }
                }).shortcut({
                    pattern: "a b c d e f g h i j k l m n o p q r s t u v w x y z dig0 dig1 dig2 dig3 dig4 dig5 dig6 dig7 dig8 dig9 num0 num1 num2 num3 num4 num5 num6 num7 num8 num9",
                    description: s.i18n("firstLetterSearch"),
                    callback: function (e) {
                        var t;
                        i && (t = function () {
                            var e = s.selected(),
                                e = st.ui.keyCode[!e.length || s.cwdHash2Elm(e[0]).next("[id]").length ? "RIGHT" : "HOME"];
                            st(document).trigger(st.Event("keydown", {
                                keyCode: e,
                                ctrlKey: !1,
                                shiftKey: !1,
                                altKey: !1,
                                metaKey: !1
                            }))
                        }, 96 <= (e = e.originalEvent.keyCode) && e <= 105 && (e -= 48), e = "/" + String.fromCharCode(e), f !== e ? (m.val(e), f = e, s.trigger("incsearchstart", {
                            query: e
                        }).one("cwdrender", t)) : t())
                    }
                })
            })
        }, st.fn.elfindersortbutton = function (m) {
            return this.each(function () {
                function e() {
                    i.toHide(h)
                }

                function t() {
                    h.children("[rel]").removeClass(l + " " + c + " " + d).filter('[rel="' + i.sortType + '"]').addClass(l + " " + ("asc" == i.sortOrder ? c : d)), h.children(".elfinder-sort-stick").toggleClass(l, i.sortStickFolders), h.children(".elfinder-sort-tree").toggleClass(l, i.sortAlsoTreeview)
                }
                var n, i = m.fm,
                    a = m.name,
                    o = i.res("class", "disabled"),
                    r = i.res("class", "hover"),
                    s = "elfinder-button-menu-item",
                    l = s + "-selected",
                    c = l + "-asc",
                    d = l + "-desc",
                    p = st('<span class="elfinder-button-text">' + m.title + "</span>"),
                    u = st(this).addClass("ui-state-default elfinder-button elfinder-menubutton elfiner-button-" + a).attr("title", m.title).append('<span class="elfinder-button-icon elfinder-button-icon-' + a + '"></span>', p).on("mouseenter mouseleave", function (e) {
                        u.hasClass(o) || u.toggleClass(r, "mouseenter" === e.type)
                    }).on("click", function (e) {
                        u.hasClass(o) || (e.stopPropagation(), h.is(":hidden") && i.getUI().click(), h.css(f()).slideToggle({
                            duration: 100,
                            done: function (e) {
                                i[h.is(":visible") ? "toFront" : "toHide"](h)
                            }
                        }))
                    }),
                    h = st('<div class="ui-front ui-widget ui-widget-content elfinder-button-menu elfinder-button-sort-menu ui-corner-all"></div>').hide().appendTo(i.getUI()).on("mouseenter mouseleave", "." + s, function (e) {
                        st(this).toggleClass(r, "mouseenter" === e.type)
                    }).on("click", function (e) {
                        e.preventDefault(), e.stopPropagation()
                    }).on("close", e),
                    f = function () {
                        var e = i.getUI().offset(),
                            t = u.offset();
                        return {
                            top: t.top - e.top,
                            left: t.left - e.left
                        }
                    };
                p.hide(), st.each(i.sortRules, function (e, t) {
                    h.append(st('<div class="' + s + '" rel="' + e + '"><span class="ui-icon ui-icon-arrowthick-1-n"></span><span class="ui-icon ui-icon-arrowthick-1-s"></span>' + i.i18n("sort" + e) + "</div>").data("type", e))
                }), h.children().on("click", function (e) {
                    m.exec([], st(this).removeClass(r).attr("rel"))
                }), st('<div class="' + s + " " + s + '-separated elfinder-sort-ext elfinder-sort-stick"><span class="ui-icon ui-icon-check"></span>' + i.i18n("sortFoldersFirst") + "</div>").appendTo(h).on("click", function () {
                    m.exec([], "stick")
                }), i.one("init", function () {
                    i.ui.tree && null !== i.options.sortAlsoTreeview && st('<div class="' + s + " " + s + '-separated elfinder-sort-ext elfinder-sort-tree"><span class="ui-icon ui-icon-check"></span>' + i.i18n("sortAlsoTreeview") + "</div>").appendTo(h).on("click", function () {
                        m.exec([], "tree")
                    })
                }).bind("disable select", e).bind("sortchange", t).getUI().on("click", e), 1 < h.children().length ? m.change(function () {
                    n && cancelAnimationFrame(n), n = requestAnimationFrame(function () {
                        u.toggleClass(o, m.disabled()), t()
                    })
                }).change() : u.addClass(o)
            })
        }, st.fn.elfinderstat = function (p) {
            return this.each(function () {
                function t(e) {
                    r.find("span.elfinder-stat-incsearch").html(e ? e.hashes.length + " / " : ""), r.attr("title", r.text()), p.trigger("uistatchange")
                }

                function e(e) {
                    var t, n, i = 0,
                        a = 0,
                        o = [];
                    1 === e.length ? (n = e[0], i = n.size, 2 === p.searchStatus.state && (t = p.escape(n.path ? n.path.replace(/\/[^\/]*$/, "") : ".."), o.push('<a href="#elf_' + n.phash + '" data-hash="' + n.hash + '" title="' + t + '">' + t + "</a>")), o.push(p.escape(n.i18 || n.name)), s.html(o.join("/") + (0 < i ? ", " + p.formatSize(i) : ""))) : e.length ? (st.each(e, function (e, t) {
                        a++, i += parseInt(t.size) || 0
                    }), s.html(a ? c + ": " + a + ", " + d + ": " + p.formatSize(i) : "&nbsp;")) : s.html(""), s.attr("title", s.text()), p.trigger("uistatchange")
                }
                var r = st(this).addClass("elfinder-stat-size"),
                    s = st('<div class="elfinder-stat-selected"></div>').on("click", "a", function (e) {
                        var t = st(this).data("hash");
                        e.preventDefault(), p.exec("opendir", [t])
                    }),
                    l = p.i18n("items"),
                    c = p.i18n("selected"),
                    d = p.i18n("size");
                p.getUI("statusbar").prepend(r).append(s).show(), p.UA.Mobile && st.fn.tooltip && p.getUI("statusbar").tooltip({
                    classes: {
                        "ui-tooltip": "elfinder-ui-tooltip ui-widget-shadow"
                    },
                    tooltipClass: "elfinder-ui-tooltip ui-widget-shadow",
                    track: !0
                }), p.bind("cwdhasheschange", function (e) {
                    var n, i, t, a, o;
                    e = st.map(e.data, function (e) {
                        return p.file(e)
                    }), i = n = 0, t = p.cwd(), o = a = !0, (t.sizeInfo || t.size) && (i = t.size, a = !1), st.each(e, function (e, t) {
                        n++, a && (i += parseInt(t.size) || 0, !0 !== o || "directory" !== t.mime || t.sizeInfo || (o = !1))
                    }), r.html(l + ': <span class="elfinder-stat-incsearch"></span>' + n + ',&nbsp;<span class="elfinder-stat-size' + (o ? " elfinder-stat-size-recursive" : "") + '">' + p.i18n(o ? "sum" : "size") + ": " + p.formatSize(i) + "</span>").attr("title", r.text()), p.trigger("uistatchange")
                }).change(function (e) {
                    var e = e.data.changed || [],
                        t = p.cwd().hash;
                    st.each(e, function () {
                        if (this.hash === t) return this.size && (r.children(".elfinder-stat-size").addClass("elfinder-stat-size-recursive").html(p.i18n("sum") + ": " + p.formatSize(this.size)), r.attr("title", r.text())), !1
                    })
                }).select(function () {
                    e(p.selectedFiles())
                }).bind("open", function () {
                    e([])
                }).bind("incsearch", function (e) {
                    t(e.data)
                }).bind("incsearchend", function () {
                    t()
                })
            })
        }, st.fn.elfindertoast = function (o, r) {
            var e = Object.assign({
                mode: "success",
                msg: "",
                showMethod: "fadeIn",
                showDuration: 300,
                showEasing: "swing",
                onShown: void 0,
                hideMethod: "fadeOut",
                hideDuration: 1500,
                hideEasing: "swing",
                onHidden: void 0,
                timeOut: 3e3,
                extNode: void 0,
                button: void 0,
                width: void 0
            }, st.isPlainObject(r.options.uiOptions.toast.defaults) ? r.options.uiOptions.toast.defaults : {});
            return this.each(function () {
                o = Object.assign({}, e, o || {});

                function t(e) {
                    i.stop(), r.toFront(i), i[o.showMethod]({
                        duration: o.showDuration,
                        easing: o.showEasing,
                        complete: function () {
                            o.onShown && o.onShown(), !e && o.timeOut && (n = setTimeout(a, o.timeOut))
                        }
                    })
                }
                var n, i = st(this),
                    a = function () {
                        i[o.hideMethod]({
                            duration: o.hideDuration,
                            easing: o.hideEasing,
                            complete: function () {
                                o.onHidden && o.onHidden(), i.remove()
                            }
                        })
                    };
                i.on("click", function (e) {
                    e.stopPropagation(), e.preventDefault(), n && clearTimeout(n), o.onHidden && o.onHidden(), i.stop().remove()
                }).on("mouseenter mouseleave", function (e) {
                    o.timeOut && (n && clearTimeout(n), n = null, "mouseenter" === e.type ? t(!0) : n = setTimeout(a, o.timeOut))
                }).hide().addClass("toast-" + o.mode).append(st('<div class="elfinder-toast-msg"></div>').html(o.msg.replace(/%([a-zA-Z0-9]+)%/g, function (e, t) {
                    return r.i18n(t)
                }))), o.extNode && i.append(o.extNode), o.button && i.append(st('<button class="ui-button ui-widget ui-state-default ui-corner-all elfinder-tabstop"></button>').append(st('<span class="ui-button-text"></span>').text(r.i18n(o.button.text))).on("mouseenter mouseleave", function (e) {
                    st(this).toggleClass("ui-state-hover", "mouseenter" == e.type)
                }).on("click", o.button.click || function () { })), o.width && i.css("max-width", o.width), t()
            })
        }, st.fn.elfindertoolbar = function (w, x) {
            return this.not(".elfinder-toolbar").each(function () {
                function a(e) {
                    var t, n;
                    for (st.each(m, function (e, t) {
                        t.detach()
                    }), h.empty(), i = g.length; i--;)
                        if (g[i]) {
                            for (s = st('<div class="ui-widget-content ui-corner-all elfinder-buttonset"></div>'), o = g[i].length; o--;) t = g[i][o], e && e[t] || !(r = u[t]) || (l = "elfinder" + r.options.ui, !m[t] && st.fn[l] && (m[t] = st("<div></div>")[l](r)), m[t] && (m[t].children(".elfinder-button-text")[p ? "show" : "hide"](), s.prepend(m[t])));
                            s.children().length && h.prepend(s), s.children(":gt(0)").before('<span class="ui-widget-content elfinder-toolbar-button-separator"></span>')
                        } (n = u.preference) && ("always" === f.showPreferenceButton || !h.children().length && "auto" === f.showPreferenceButton) && (s = st('<div class="ui-widget-content ui-corner-all elfinder-buttonset"></div>'), l = "elfinder" + r.options.ui, m[t = "preference"] = st("<div></div>")[l](n), m[t].children(".elfinder-button-text")[p ? "show" : "hide"](), s.prepend(m[t]), h.append(s)), !h.data("swipeClose") && h.children().length ? h.show() : h.hide(), y = h[0].clientHeight, w.trigger("toolbarload").trigger("uiresize")
                }
                var i, o, r, s, l, c, d, p, t, e, u = w._commands,
                    h = st(this).addClass("ui-helper-clearfix ui-widget-header elfinder-toolbar"),
                    f = {
                        displayTextLabel: !1,
                        labelExcludeUA: ["Mobile"],
                        autoHideUA: ["Mobile"],
                        showPreferenceButton: "none"
                    },
                    m = {},
                    g = (e = x || [], st.grep(e, function (e) {
                        return !st.isPlainObject(e) || (f = Object.assign(f, e), !1)
                    })),
                    v = null,
                    b = "",
                    y = 0,
                    n = [];
                f.showPreferenceButton = f.showPreferenceButton.toLowerCase(), "none" !== f.displayTextLabel && (p = null === (p = w.storage("toolbarTextLabel")) ? f.displayTextLabel && (!f.labelExcludeUA || !f.labelExcludeUA.length || !st.grep(f.labelExcludeUA, function (e) {
                    return !!w.UA[e]
                }).length) : 1 == p, n.push({
                    label: w.i18n("textLabel"),
                    icon: "text",
                    callback: function () {
                        p = !p, h.css("height", "").find(".elfinder-button-text")[p ? "show" : "hide"](), w.trigger("uiresize").storage("toolbarTextLabel", p ? "1" : "0")
                    }
                })), f.preferenceInContextmenu && u.preference && n.push({
                    label: w.i18n("toolbarPref"),
                    icon: "preference",
                    callback: function () {
                        w.exec("preference", void 0, {
                            tab: "toolbar"
                        })
                    }
                }), n.length && h.on("contextmenu", function (e) {
                    e.stopPropagation(), e.preventDefault(), w.trigger("contextmenu", {
                        raw: n,
                        x: e.pageX,
                        y: e.pageY
                    })
                }).on("touchstart", function (e) {
                    1 < e.originalEvent.touches.length || (h.data("tmlongtap") && clearTimeout(h.data("tmlongtap")), h.removeData("longtap").data("longtap", {
                        x: e.originalEvent.touches[0].pageX,
                        y: e.originalEvent.touches[0].pageY
                    }).data("tmlongtap", setTimeout(function () {
                        h.removeData("longtapTm").trigger({
                            type: "contextmenu",
                            pageX: h.data("longtap").x,
                            pageY: h.data("longtap").y
                        }).data("longtap", {
                            longtap: !0
                        })
                    }, 500)))
                }).on("touchmove touchend", function (e) {
                    h.data("tmlongtap") && (("touchend" === e.type || 4 < Math.abs(h.data("longtap").x - e.originalEvent.touches[0].pageX) + Math.abs(h.data("longtap").y - e.originalEvent.touches[0].pageY)) && clearTimeout(h.data("tmlongtap")), h.removeData("longtapTm"))
                }).on("click", function (e) {
                    h.data("longtap") && h.data("longtap").longtap && (e.stopImmediatePropagation(), e.preventDefault())
                }).on("touchend click", ".elfinder-button", function (e) {
                    h.data("longtap") && h.data("longtap").longtap && (e.stopImmediatePropagation(), e.preventDefault())
                }), h.prev().length && h.parent().prepend(this), a(), w.bind("open sync select toolbarpref", function () {
                    var e, t, n = Object.assign({}, w.option("disabledFlip")),
                        i = w.storage("toolbarhides");
                    if (!i && Array.isArray(f.defaultHides) && (i = {}, st.each(f.defaultHides, function () {
                        i[this] = !0
                    }), w.storage("toolbarhides", i)), "select" === this.type) {
                        if (w.searchStatus.state < 2) return;
                        (t = w.selected()).length && (n = w.getDisabledCmds(t, !0))
                    }
                    st.each(i, function (e) {
                        n[e] || (n[e] = !0)
                    }), Object.keys(w.commandMap).length && st.each(w.commandMap, function (e, t) {
                        "hidden" === t && (n[e] = !0)
                    }), t = Object.keys(n), v && v.toString() === t.sort().toString() || (a(t.length ? n : null), e = !0), v = t.sort(), !e && b === JSON.stringify(w.commandMap) || (b = JSON.stringify(w.commandMap), e || st.each(st("div.elfinder-button"), function () {
                        var e = st(this).data("origin");
                        e && st(this).after(e).detach()
                    }), Object.keys(w.commandMap).length && st.each(w.commandMap, function (e, t) {
                        var n = w._commands[t],
                            i = n ? "elfinder" + n.options.ui : null;
                        i && st.fn[i] && (e = m[e]) && (!m[t] && st.fn[i] && (m[t] = st("<div></div>")[i](n), m[t] && (m[t].children(".elfinder-button-text")[p ? "show" : "hide"](), n.extendsCmd && m[t].children("span.elfinder-button-icon").addClass("elfinder-button-icon-" + n.extendsCmd))), m[t] && (e.after(m[t]), m[t].data("origin", e.detach())))
                    }))
                }).bind("resize", function (e) {
                    t && cancelAnimationFrame(t), t = requestAnimationFrame(function () {
                        var e = h[0].clientHeight;
                        y !== e && (y = e, w.trigger("uiresize"))
                    })
                }), w.UA.Touch && (void 0 === (d = w.storage("autoHide") || {}).toolbar && (d.toolbar = f.autoHideUA && 0 < f.autoHideUA.length && st.grep(f.autoHideUA, function (e) {
                    return !!w.UA[e]
                }).length, w.storage("autoHide", d)), d.toolbar && w.one("init", function () {
                    w.uiAutoHide.push(function () {
                        h.stop(!0, !0).trigger("toggle", {
                            duration: 500,
                            init: !0
                        })
                    })
                }), w.bind("load", function () {
                    "none" !== (c = st('<div class="elfinder-toolbar-swipe-handle"></div>').hide().appendTo(w.getUI())).css("pointer-events") && (c.remove(), c = null)
                }), h.on("toggle", function (e, t) {
                    var n = w.getUI("workzone"),
                        i = h.is(":hidden"),
                        a = n.height(),
                        o = h.height(),
                        r = h.outerHeight(!0) - o,
                        s = Object.assign({
                            step: function (e) {
                                n.height(a + (i ? -1 * (e + r) : o - e)), w.trigger("resize")
                            },
                            always: function () {
                                requestAnimationFrame(function () {
                                    h.css("height", ""), w.trigger("uiresize"), c && (i ? c.stop(!0, !0).hide() : (c.height(t.handleH || ""), w.resources.blink(c, "slowonce"))), i && h.scrollTop("0px"), t.init && w.trigger("uiautohide")
                                })
                            }
                        }, t);
                    h.data("swipeClose", !i).stop(!0, !0).animate({
                        height: "toggle"
                    }, s), d.toolbar = !i, w.storage("autoHide", Object.assign(w.storage("autoHide"), {
                        toolbar: d.toolbar
                    }))
                }).on("touchstart", function (e) {
                    5 < h.scrollBottom() && (e.originalEvent._preventSwipeY = !0)
                }))
            }), this
        }, st.fn.elfindertree = function (oe, re) {
            var se = oe.res("class", "tree");
            return this.not("." + se).each(function () {
                function s(e) {
                    var t = ie.offset().left;
                    return t <= e && e <= t + ie.width()
                }

                function p(a, e) {
                    function t(e) {
                        var l, t, a = st.Deferred(),
                            o = te(e);
                        return (e = st.map(o, function (t) {
                            var n, e, i = oe.file(t),
                                a = !!i && oe.isRoot(i),
                                o = oe.navHash2Elm(t),
                                r = function (e, t) {
                                    t = t || 1, e = !!(e = oe.file(e)) && e.phash;
                                    return e && 1 < t ? r(e, --t) : e
                                },
                                s = function () {
                                    var e = r(t);
                                    for (n = e; e && !oe.navHash2Elm(e).hasClass(x);) e = r(n = e);
                                    return e || (n = void 0, e = oe.root(t)), e
                                }();
                            return o.hasClass(x) || !a && i && oe.navHash2Elm(i.phash).hasClass(x) ? null : (a || s === r(t) || s === r(t, 2) ? (n = void 0, e = "tree", a || (t = r(t))) : e = "parents", l = l || ("tree" === e ? t : s), o = {
                                cmd: o = e,
                                target: t
                            }, (i = n) && (o.until = i), oe.request({
                                data: o,
                                preventFail: !0
                            }))
                        })).length ? (E(oe.file(l)), t = oe.navHash2Id(l), c && M(t), r = st("#" + t), s = st(oe.res("tpl", "navspinner")).insertBefore(r.children("." + b)), r.removeClass(g), st.when.apply(st, e).done(function () {
                            var e, t, n = {},
                                i = arguments.length;
                            if (0 < i)
                                for (t = 0; t < i; t++) e = arguments[t].tree || [], n[o[t]] = Object.assign([], S(e));
                            a.resolve(n)
                        }).fail(function () {
                            a.reject()
                        }), a) : a.resolve()
                    }

                    function n(e, t) {
                        function n() {
                            P && r && (O(r.hash).show().prev(m).addClass(v), P = !1), c ? M().done(T) : T()
                        }
                        var i;
                        e && st.each(e, function (e, t) {
                            t && I(t), E(oe.file(e)), t && F(t, x)
                        }), a && (oe.api < 2.1 && a.push(o), I(a)), (i = E()).hasClass(y) || (U.find(m + "." + y).removeClass(y), i.addClass(y)), i.parents(".elfinder-navbar-wrapper").children("." + f).addClass(x), e ? oe.lazy(n).done(function () {
                            t.resolve()
                        }) : (n(), t.resolve())
                    }

                    function i(e) {
                        r && (s.remove(), r.addClass(g + (e ? "" : " " + x)))
                    }
                    var r, s, o = oe.cwd(),
                        l = o.hash,
                        c = void 0 === e ? R : e,
                        d = st.Deferred();
                    oe.navHash2Elm(l).length ? n(void 0, d) : (u = !0, t().done(function (e) {
                        n(e, d), i()
                    }).fail(function () {
                        i(!0), d.reject()
                    }).always(function () {
                        u = !1
                    })), oe.trigger("treesync", d)
                }
                var i, l, u, e, t = "class",
                    w = oe.UA.Mobile,
                    a = oe.res(t, "treeroot"),
                    P = re.openRootOnLoad,
                    q = re.openCwdOnOpen,
                    R = q || re.syncTree,
                    h = oe.res(t, "navsubtree"),
                    f = oe.res(t, "treedir"),
                    m = "span." + f,
                    g = oe.res(t, "navcollapse"),
                    v = oe.res(t, "navexpand"),
                    x = "elfinder-subtree-loaded",
                    H = "elfinder-subtree-chksubdir",
                    b = oe.res(t, "navarrow"),
                    y = oe.res(t, "active"),
                    c = oe.res(t, "adroppable"),
                    d = oe.res(t, "hover"),
                    o = oe.res(t, "disabled"),
                    _ = oe.res(t, "draggable"),
                    N = oe.res(t, "droppable"),
                    n = "elfinder-navbar-wrapper-root",
                    r = "elfinder-navbar-wrapper-pastable",
                    k = "elfinder-navbar-wrapper-uploadable",
                    C = {},
                    z = [],
                    L = function (e) {
                        var n = [];
                        if (st.each(e, function (e, t) {
                            C[t] && n.push(oe.navId2Hash(t)), delete C[t]
                        }), n.length) return oe.request({
                            data: {
                                cmd: "subdirs",
                                targets: n,
                                preventDefault: !0
                            }
                        }).done(function (e) {
                            e && e.subdirs && st.each(e.subdirs, function (e, t) {
                                e = oe.navHash2Elm(e);
                                e.removeClass(H), e[t ? "addClass" : "removeClass"](g)
                            })
                        })
                    },
                    W = null,
                    T = function () {
                        var e = Object.keys(C);
                        e.length && (W && W._abort(), i && clearTimeout(i), z = [], W = oe.asyncJob(function (e) {
                            return oe.isInWindow(st("#" + e)) ? e : null
                        }, e, {
                            numPerOnce: 200
                        }).done(function (e) {
                            e.length && (z = e, $())
                        }))
                    },
                    B = 0,
                    $ = function () {
                        var e, t = re.subdirsMaxConn - B,
                            n = oe.maxTargets ? Math.min(oe.maxTargets, re.subdirsAtOnce) : re.subdirsAtOnce;
                        if (i && cancelAnimationFrame(i), z.length)
                            if (0 < t)
                                for (e = 0; e < t; e++) z.length && (B++, L(z.splice(0, n)).always(function () {
                                    B--, $()
                                }));
                            else i = requestAnimationFrame(function () {
                                z.length && $()
                            })
                    },
                    V = oe.droppable.drop,
                    K = st.extend(!0, {}, oe.droppable, {
                        over: function (e, n) {
                            var i, t, a = st(this),
                                o = n.helper,
                                r = d + " " + c;
                            if (e.stopPropagation(), o.data("dropover", o.data("dropover") + 1), a.data("dropover", !0), n.helper.data("namespace") !== oe.namespace || !oe.insideWorkzone(e.pageX, e.pageY)) return a.removeClass(r), void o.removeClass("elfinder-drag-helper-move elfinder-drag-helper-plus");
                            s(e.clientX) ? (o.removeClass("elfinder-drag-helper-move elfinder-drag-helper-plus"), a.addClass(d), a.is("." + g + ":not(." + v + ")") && a.data("expandTimer", setTimeout(function () {
                                a.is("." + g + "." + d) && a.children("." + b).trigger("click")
                            }, 500)), a.is(".elfinder-ro,.elfinder-na") ? a.removeClass(c) : (i = oe.navId2Hash(a.attr("id")), a.data("dropover", i), st.each(n.helper.data("files"), function (e, t) {
                                if (t === i || oe.file(t).phash === i && !n.helper.hasClass("elfinder-drag-helper-plus")) return a.removeClass(r), !1
                            }), o.data("locked") ? t = "elfinder-drag-helper-plus" : (t = "elfinder-drag-helper-move", oe._commands.copy && (e.shiftKey || e.ctrlKey || e.metaKey) && (t += " elfinder-drag-helper-plus")), a.hasClass(c) && o.addClass(t), requestAnimationFrame(function () {
                                a.hasClass(c) && o.addClass(t)
                            }))) : a.removeClass(r)
                        },
                        out: function (e, t) {
                            var n = st(this),
                                t = t.helper;
                            e.stopPropagation(), s(e.clientX) && t.removeClass("elfinder-drag-helper-move elfinder-drag-helper-plus"), t.data("dropover", Math.max(t.data("dropover") - 1, 0)), n.data("expandTimer") && clearTimeout(n.data("expandTimer")), n.removeData("dropover").removeClass(d + " " + c)
                        },
                        deactivate: function () {
                            st(this).removeData("dropover").removeClass(d + " " + c)
                        },
                        drop: function (e, t) {
                            s(e.clientX) && V.call(this, e, t)
                        }
                    }),
                    X = st(oe.res("tpl", "navspinner")),
                    J = oe.res("tpl", "navdir"),
                    G = oe.res("tpl", "perms"),
                    Y = (oe.res("tpl", "lock"), oe.res("tpl", "symlink")),
                    A = {},
                    Q = {
                        id: function (e) {
                            return oe.navHash2Id(e.hash)
                        },
                        name: function (e) {
                            return oe.escape(e.i18 || e.name)
                        },
                        cssclass: function (e) {
                            var t = (e.phash && !e.isroot ? "" : a) + " " + f + " " + oe.perms2class(e);
                            return e.dirs && !e.link && (t += " " + g) && -1 == e.dirs && (t += " " + H), re.getClass && (t += " " + re.getClass(e)), e.csscls && (t += " " + oe.escape(e.csscls)), t
                        },
                        title: function (e) {
                            return re.attrTitle ? ' title="' + oe.escape(oe.path(e.hash, !0) || e.i18 || e.name) + '"' : ""
                        },
                        root: function (e) {
                            var t = "";
                            return !e.phash || e.isroot ? (t += " " + n, !e.disabled || e.disabled.length < 1 ? t += " " + r + " " + k : (-1 === st.inArray("paste", e.disabled) && (t += " " + r), -1 === st.inArray("upload", e.disabled) && (t += " " + k)), t) : ""
                        },
                        permissions: function (e) {
                            return e.read && e.write ? "" : G
                        },
                        symlink: function (e) {
                            return e.alias ? Y : ""
                        },
                        style: function (e) {
                            return e.icon ? oe.getIconStyle(e) : ""
                        }
                    },
                    j = function (i) {
                        return J.replace(/(?:\{([a-z]+)\})/gi, function (e, t) {
                            var n = Q[t] ? Q[t](i) : i[t] || "";
                            return "id" === t && -1 == i.dirs && (C[n] = n), n
                        })
                    },
                    S = function (e, t) {
                        return st.map(e || [], function (e) {
                            return "directory" !== e.mime || t && !oe.navHash2Elm(e.hash).length ? null : e
                        })
                    },
                    O = function (e) {
                        return e ? oe.navHash2Elm(e).next("." + h) : U
                    },
                    Z = function (e, t) {
                        for (var n, i = e.children(":first"); i.length;) {
                            if (oe.file(oe.navId2Hash(i.children("[id]").attr("id"))), (n = oe.file(oe.navId2Hash(i.children("[id]").attr("id")))) && ee(t, n) < 0) return i;
                            i = i.next()
                        }
                        return e.children("button.elfinder-navbar-pager-next")
                    },
                    I = function (e) {
                        function n(c, d, e, t) {
                            function p(e, t) {
                                var n;
                                e.stopPropagation(), t.select ? b(g(t.select)) : t.change ? i(t.change) : (t.removed && t.removed.length && (d = st.grep(d, function (e) {
                                    return -1 === t.removed.indexOf(e.hash) || (n = n || !0, !1)
                                })), t.added && t.added.length && (d = d.concat(st.grep(t.added, function (e) {
                                    return void 0 === u[e.hash] && (n = n || !0, !0)
                                }))), n && (d.sort(ee), m(), b(h)))
                            }
                            var u = {},
                                h = 0,
                                f = oe.newAPI ? Math.min(1e4, Math.max(10, re.subTreeMax)) : 1e4,
                                m = function () {
                                    u = {}, st.each(d, function (e, t) {
                                        u[t.hash] = e
                                    })
                                },
                                i = function (e) {
                                    "prepare" === e ? st.each(d, function (e, t) {
                                        t.node && c.append(t.node.hide())
                                    }) : "done" === e && st.each(d, function (e, t) {
                                        t.node && t.node.detach().show()
                                    })
                                },
                                g = function (e) {
                                    if (void 0 !== u[e]) return Math.floor(u[e] / f) * f
                                },
                                v = oe.navId2Hash(c.prev("[id]").attr("id")),
                                b = function (e, t) {
                                    var n, i, a, o, r, s = [],
                                        l = {};
                                    delete A[v], h = e, c.off("update." + oe.namespace, p), d.length > f && (c.on("update." + oe.namespace, p), void 0 === e && (m(), void 0 === (e = g(y.hash)) && (e = 0)), i = d.slice(e, e + f), A[v] = c, a = e ? Math.max(-1, e - f) : -1, o = e + f >= d.length ? 0 : e + f, n = Math.ceil(d.length / f), r = Math.ceil(e / f)), st.each(i || d, function (e, t) {
                                        s.push(j(t)), t.node && (l[t.hash] = t.node)
                                    }), e = -1 < a ? st('<button class="elfinder-navbar-pager elfinder-navbar-pager-prev"></button>').text(oe.i18n("btnPrevious", r, n)).button({
                                        icons: {
                                            primary: "ui-icon-caret-1-n"
                                        }
                                    }).on("click", function (e) {
                                        e.preventDefault(), e.stopPropagation(), b(a, "up")
                                    }) : st(), r = o ? st('<button class="elfinder-navbar-pager elfinder-navbar-pager-next"></button>').text(oe.i18n("btnNext", r + 2, n)).button({
                                        icons: {
                                            primary: "ui-icon-caret-1-s"
                                        }
                                    }).on("click", function (e) {
                                        e.preventDefault(), e.stopPropagation(), b(o, "down")
                                    }) : st(), st.each(c.children(".elfinder-navbar-wrapper"), function (e, t) {
                                        var t = st(t),
                                            n = t.children("[id]:first");
                                        n.hasClass(x) && (n = oe.navId2Hash(n.attr("id"))) && void 0 !== (n = u[n]) && (d[n].node = t.detach())
                                    }), c.empty()[i ? "addClass" : "removeClass"]("elfinder-navbar-hasmore").append(e, s.join(""), r), st.each(l, function (e, t) {
                                        oe.navHash2Elm(e).parent().replaceWith(t)
                                    }), t && M(oe.navHash2Id(i["up" === t ? i.length - 1 : 0].hash)), w || oe.lazy(function () {
                                        D(null, c)
                                    })
                                };
                            b()
                        }
                        for (var t, i, a, o, r, s, l, c = e.length, d = [], p = c, u = st(), h = {}, y = oe.cwd(), f = {}, m = [], g = {}; p--;) h[(t = e[p]).hash] || oe.navHash2Elm(t.hash).length || (h[t.hash] = !0, (i = O(t.phash)).length ? (void 0 === g[l = t.phash || "treeroot"] && (g[l] = i.children(":last")), o = !g[l].length, t.phash && (o || i.hasClass("elfinder-navbar-hasmore") || (a = Z(i, t)).length) ? o ? (f[t.phash] || (f[t.phash] = []), f[t.phash].push(t)) : a ? (s = j(t), a.before(s), w || (u = u.add(s))) : m.push(t) : (s = j(t), o ? i.prepend(s) : g[l].after(s), t.phash && !t.isroot || (r = oe.navHash2Elm(t.hash).parent()), w || D(null, r))) : d.push(t));
                        Object.keys(f).length && st.each(f, function (e, t) {
                            e = O(e);
                            t.sort(ee), n(e, t)
                        }), m.length && i.trigger("update." + oe.namespace, {
                            added: m
                        }), d.length && d.length < c ? I(d) : !w && u.length && oe.lazy(function () {
                            D(u)
                        })
                    },
                    ee = function (e, t) {
                        var n, i, a, o;
                        return oe.sortAlsoTreeview ? (n = "asc" == oe.sortOrder, i = oe.sortType, a = oe.sortRules, o = n ? a[oe.sortType](e, t) : a[oe.sortType](t, e), "name" !== i && 0 === o ? n ? a.name(e, t) : a.name(t, e) : o) : oe.sortRules.name(e, t)
                    },
                    M = function (e) {
                        var t, n, i, a, o, r = st.Deferred();
                        return l && clearTimeout(l), l = setTimeout(function () {
                            (o = st(document.getElementById(e || oe.navHash2Id(oe.cwd().hash)))).length ? ((q ? o : o.parent()).parents(".elfinder-navbar-wrapper").children("." + x).addClass(v).next("." + h).show(), t = U.parent().stop(!1, !0), n = t.offset().top, i = t.height(), a = n + i - o.outerHeight(), (o = o.offset().top) < n || a < o ? t.animate({
                                scrollTop: t.scrollTop() + o - n - i / 3
                            }, {
                                duration: re.durations.autoScroll,
                                complete: function () {
                                    r.resolve()
                                }
                            }) : r.resolve()) : r.reject()
                        }, 100), r
                    },
                    te = function (e) {
                        for (var t, e = e || oe.cwd(), n = e.hash ? [e.hash] : [], i = oe.root(e.hash), a = oe.file(i); a && (t = a.phash) && (n.unshift(t), i = oe.root(t), a = oe.file(i), !oe.navHash2Elm(a.hash).hasClass(x)););
                        return n
                    },
                    E = function (e) {
                        var t = e || oe.cwd(),
                            e = t.hash,
                            n = oe.navHash2Elm(e);
                        if (!n.length) {
                            for (; t && t.phash;) A[t.phash] && !oe.navHash2Elm(t.hash).length && A[t.phash].trigger("update." + oe.namespace, {
                                select: t.hash
                            }), t = oe.file(t.phash);
                            n = oe.navHash2Elm(e)
                        }
                        return n
                    },
                    D = function (e, t) {
                        e || (t && !t.closest("div." + n).hasClass(k) || (t || U.find("div." + k)).find(m + ":not(.elfinder-ro,.elfinder-na)").addClass("native-droppable"), e = !t || t.closest("div." + n).hasClass(r) ? (t || U.find("div." + r)).find(m + ":not(." + N + ")") : st(), t && t.children("div." + n).each(function () {
                            D(null, st(this))
                        })), e.length && oe.asyncJob(function (e) {
                            st(e).droppable(K)
                        }, st.makeArray(e), {
                            interval: 20,
                            numPerOnce: 100
                        })
                    },
                    F = function (e, n) {
                        var i = n == x ? "." + g + ":not(." + x + ")" : ":not(." + g + ")";
                        st.each(e, function (e, t) {
                            oe.navHash2Elm(t.phash).filter(i).filter(function () {
                                return 0 < st.grep(st(this).next("." + h).children(), function (e) {
                                    return !st(e).children().hasClass(a)
                                }).length
                            }).addClass(n)
                        })
                    },
                    U = st(this).addClass(se).on("mouseenter mouseleave", m, function (e) {
                        var t, n, e = "mouseenter" === e.type;
                        e && ne || ((t = st(this)).hasClass(c + " " + o) || (w || !e || t.data("dragRegisted") || t.hasClass(a + " " + _ + " elfinder-na elfinder-wo") || (t.data("dragRegisted", !0), oe.isCommandEnabled("copy", n = oe.navId2Hash(t.attr("id"))) && t.draggable(oe.draggable)), t.toggleClass(d, e)), e && re.attrTitle && ((e = oe.file(n || oe.navId2Hash(t.attr("id")))).isroot || t.attr("title") !== (e.i18 || e.name) || t.attr("title", oe.path(n, !0))))
                    }).on("dragenter", m, function (e) {
                        var t;
                        e.originalEvent.dataTransfer && ((t = st(this)).addClass(d), t.is("." + g + ":not(." + v + ")") && t.data("expandTimer", setTimeout(function () {
                            t.is("." + g + "." + d) && t.children("." + b).trigger("click")
                        }, 500)))
                    }).on("dragleave", m, function (e) {
                        e.originalEvent.dataTransfer && ((e = st(this)).data("expandTimer") && clearTimeout(e.data("expandTimer")), e.removeClass(d))
                    }).on("click", m, function (e) {
                        var t = st(this),
                            n = oe.navId2Hash(t.attr("id"));
                        oe.file(n);
                        if (t.data("longtap")) return t.removeData("longtap"), void e.stopPropagation();
                        t.hasClass(y) || (U.find(m + "." + y).removeClass(y), t.addClass(y)), n == oe.cwd().hash || t.hasClass(o) ? (t.hasClass(g) && t.children("." + b).trigger("click"), oe.select({
                            selected: [n],
                            origin: "navbar"
                        })) : oe.exec("open", n).done(function () {
                            oe.one("opendone", function () {
                                oe.select({
                                    selected: [n],
                                    origin: "navbar"
                                })
                            })
                        })
                    }).on("touchstart", m, function (e) {
                        var t, n;
                        1 < e.originalEvent.touches.length || (t = e.originalEvent, "INPUT" === e.target.nodeName ? e.stopPropagation() : n = st(this).addClass(d).removeData("longtap").data("tmlongtap", setTimeout(function (e) {
                            n.data("longtap", !0), oe.trigger("contextmenu", {
                                type: "navbar",
                                targets: [oe.navId2Hash(n.attr("id"))],
                                x: t.touches[0].pageX,
                                y: t.touches[0].pageY
                            })
                        }, 500)))
                    }).on("touchmove touchend", m, function (e) {
                        "INPUT" === e.target.nodeName ? e.stopPropagation() : (clearTimeout(st(this).data("tmlongtap")), st(this).removeData("tmlongtap"), "touchmove" == e.type && st(this).removeClass(d))
                    }).on("click", m + "." + g + " ." + b, function (e) {
                        var t = st(this),
                            n = t.parent(m),
                            i = n.next("." + h),
                            a = st.Deferred();
                        e.stopPropagation(), n.hasClass(x) ? (n.toggleClass(v), oe.lazy(function () {
                            30 < (n.hasClass(v) ? i.children().length + i.find("div.elfinder-navbar-subtree[style*=block]").children().length : i.find("div:visible").length) ? (i.toggle(), oe.draggingUiHelper && oe.draggingUiHelper.data("refreshPositions", 1), T()) : i.stop(!0, !0)[n.hasClass(v) ? "slideDown" : "slideUp"](re.durations.slideUpDown, function () {
                                oe.draggingUiHelper && oe.draggingUiHelper.data("refreshPositions", 1), T()
                            })
                        }).always(function () {
                            a.resolve()
                        })) : (X.insertBefore(t), n.removeClass(g), oe.request({
                            cmd: "tree",
                            target: oe.navId2Hash(n.attr("id"))
                        }).done(function (e) {
                            I(Object.assign([], S(e.tree))), i.children().length && (n.addClass(g + " " + v), 30 < i.children().length ? (i.show(), oe.draggingUiHelper && oe.draggingUiHelper.data("refreshPositions", 1), T()) : i.stop(!0, !0).slideDown(re.durations.slideUpDown, function () {
                                oe.draggingUiHelper && oe.draggingUiHelper.data("refreshPositions", 1), T()
                            }))
                        }).always(function (e) {
                            X.remove(), n.addClass(x), oe.one("treedone", function () {
                                a.resolve()
                            })
                        })), t.data("dfrd", a)
                    }).on("contextmenu", m, function (e) {
                        e.stopPropagation();
                        var t = st(this);
                        t.find("input:text").length || (e.preventDefault(), t.data("tmlongtap") || oe.trigger("contextmenu", {
                            type: "navbar",
                            targets: [oe.navId2Hash(st(this).attr("id"))],
                            x: e.pageX,
                            y: e.pageY
                        }), t.addClass("ui-state-hover"), oe.getUI("contextmenu").children().on("mouseenter", function () {
                            t.addClass("ui-state-hover")
                        }), oe.bind("closecontextmenu", function () {
                            t.removeClass("ui-state-hover")
                        }))
                    }).on("scrolltoview", m, function (e, t) {
                        var n = st(this);
                        M(n.attr("id")).done(function () {
                            t && "undefined" !== t.blink && !t.blink || oe.resources.blink(n, "lookme")
                        })
                    }).on("create." + oe.namespace, function (e, t) {
                        var n = O(t.phash),
                            i = t.move || !1,
                            t = st(j(t)).addClass("elfinder-navbar-wrapper-tmp"),
                            a = oe.selected();
                        i && a.length && oe.trigger("lockfiles", {
                            files: a
                        }), n.prepend(t)
                    }),
                    ne = !1,
                    ie = oe.getUI("navbar").append(U).show().on("scroll", function () {
                        ne = !0, e && cancelAnimationFrame(e), e = requestAnimationFrame(function () {
                            ne = !1, T()
                        })
                    }),
                    ae = oe.sortAlsoTreeview;
                oe.open(function (e) {
                    var e = e.data,
                        t = S(e.files),
                        n = oe.getUI("contextmenu");
                    e.init && U.empty(), oe.UA.iOS && ie.removeClass("overflow-scrolling-touch").addClass("overflow-scrolling-touch"), t.length ? oe.lazy(function () {
                        n.data("cmdMaps") || n.data("cmdMaps", {}), I(t), F(t, x), p(t)
                    }) : p()
                }).add(function (e) {
                    e = S(e.data.added);
                    e.length && (I(e), F(e, g))
                }).change(function (e) {
                    if (!u) {
                        var t, n, i, a, o, r, s, l, c = S(e.data.changed, !0),
                            e = c.length,
                            d = e;
                        st();
                        for (st.each(A, function (e, t) {
                            t.trigger("update." + oe.namespace, {
                                change: "prepare"
                            })
                        }); d--;)
                            if (i = (t = c[d]).phash, (n = oe.navHash2Elm(t.hash)).length) {
                                if (s = n.parent(), i) {
                                    if (o = n.closest("." + h), i = O(i), r = n.parent().next(), a = Z(i, t), !i.length) continue;
                                    i[0] === o[0] && r.get(0) === a.get(0) || (a.length ? a.before(s) : i.append(s))
                                }
                                o = n.hasClass(v), r = n.hasClass(x), a = st(j(t)), n.replaceWith(a.children(m)), w || D(null, s), t.dirs && (o || r) && (n = oe.navHash2Elm(t.hash)) && n.next("." + h).children().length && (o && n.addClass(v), r && n.addClass(x)), l |= -1 == t.dirs
                            } l && T(), st.each(A, function (e, t) {
                                t.trigger("update." + oe.namespace, {
                                    change: "done"
                                })
                            }), e && p(void 0, !1)
                    }
                }).remove(function (e) {
                    var t, n, i, a = e.data.removed,
                        o = a.length;
                    for (st.each(A, function (e, t) {
                        t.trigger("update." + oe.namespace, {
                            removed: a
                        }), t.trigger("update." + oe.namespace, {
                            change: "prepare"
                        })
                    }); o--;)(t = oe.navHash2Elm(a[o])).length && (i = !0, n = t.closest("." + h), t.parent().detach(), n.children().length || n.hide().prev(m).removeClass(g + " " + v + " " + x));
                    i && oe.getUI("navbar").children(".ui-resizable-handle").trigger("resize"), st.each(A, function (e, t) {
                        t.trigger("update." + oe.namespace, {
                            change: "done"
                        })
                    })
                }).bind("lockfiles unlockfiles", function (e) {
                    var n = "lockfiles" == e.type,
                        i = !!e.data.helper && e.data.helper.data("locked"),
                        a = n && !i ? "disable" : "enable",
                        e = st.grep(e.data.files || [], function (e) {
                            e = oe.file(e);
                            return !(!e || "directory" != e.mime)
                        });
                    st.each(e, function (e, t) {
                        t = oe.navHash2Elm(t);
                        t.length && !i && (t.hasClass(_) && t.draggable(a), t.hasClass(N) && t.droppable(a), t[n ? "addClass" : "removeClass"](o))
                    })
                }).bind("sortchange", function () {
                    var n, e, i, a, o, r;
                    !oe.sortAlsoTreeview && ae === oe.sortAlsoTreeview || (e = [], i = {}, o = "", r = !(a = {}), oe.lazy(function () {
                        n = S(oe.files()), ae = oe.sortAlsoTreeview, U.empty(), I(st.map(oe.roots, function (e) {
                            e = oe.file(e);
                            return e && !e.phash ? e : null
                        })), Object.keys(A).length ? (1 < (e = te()).length ? (st.each(e, function (e, t) {
                            var n = oe.file(oe.root(t)).volumeid;
                            0 === e && (o = n), a[n] = t, i[t] = []
                        }), st.each(n, function (e, t) {
                            if (!t.volumeid) return !(r = !0);
                            i[a[t.volumeid] || a[o]].push(t)
                        })) : r = !0, r ? st.each(e, function (e, t) {
                            I(n), E(oe.file(t)), F(n, x)
                        }) : st.each(i, function (e, t) {
                            I(t), E(oe.file(e)), F(t, x)
                        })) : (I(n), E(), F(n, x)), p()
                    }, 100))
                })
            }), this
        }, st.fn.elfinderuploadbutton = function (o) {
            return this.each(function () {
                var e, t = o.fm,
                    n = st(this).elfinderbutton(o).off("click"),
                    i = st("<form></form>").appendTo(n),
                    a = st('<input type="file" multiple="true" title="' + o.fm.i18n("selectForUpload") + '"/>').on("change", function () {
                        var e = st(this);
                        e.val() && (t.exec("upload", {
                            input: e.remove()[0]
                        }, void 0, t.cwd().hash), a.clone(!0).appendTo(i))
                    }).on("dragover", function (e) {
                        e.originalEvent.dataTransfer.dropEffect = "copy"
                    });
                i.append(a.clone(!0)), o.change(function () {
                    e && cancelAnimationFrame(e), e = requestAnimationFrame(function () {
                        var e = o.disabled();
                        i.is("visible") ? e || i.hide() : e && i.show()
                    })
                }).change()
            })
        }, st.fn.elfinderviewbutton = function (a) {
            return this.each(function () {
                var e, t = st(this).elfinderbutton(a),
                    n = t.children(".elfinder-button-icon"),
                    i = t.children(".elfinder-button-text");
                a.change(function () {
                    e && cancelAnimationFrame(e), e = requestAnimationFrame(function () {
                        var e = "icons" == a.value;
                        n.toggleClass("elfinder-button-icon-view-list", e), a.className = e ? "view-list" : "", a.title = a.fm.i18n(e ? "viewlist" : "viewicons"), t.attr("title", a.title), i.html(a.title)
                    })
                })
            })
        }, st.fn.elfinderworkzone = function (l) {
            var c = "elfinder-workzone";
            return this.not("." + c).each(function () {
                function e() {
                    a = o.outerHeight(!0) - o.height()
                }
                var a, o = st(this).addClass(c),
                    r = Math.round(o.height()),
                    s = o.parent(),
                    t = function (e) {
                        var t = s.height() - a,
                            n = s.attr("style"),
                            i = Math.round(o.height());
                        e && (e.preventDefault(), e.stopPropagation()), s.css("overflow", "hidden").children(":visible:not(." + c + ")").each(function () {
                            var e = st(this);
                            "absolute" != e.css("position") && "fixed" != e.css("position") && (t -= e.outerHeight(!0))
                        }), s.attr("style", n || ""), t = Math.max(0, Math.round(t)), r === t && i === t || (r = Math.round(o.height()), o.height(t), l.trigger("wzresize"))
                    };
                e(), s.on("resize." + l.namespace, t), l.one("cssloaded", function () {
                    a = o.outerHeight(!0) - o.height(), t()
                }).bind("uiresize", t).bind("themechange", e)
            }), this
        }, Fe.prototype.commands.archive = function () {
            var s, l = this,
                c = l.fm,
                d = [];
            this.variants = [], this.disableOnSearch = !1, this.nextAction = {}, c.bind("open reload", function () {
                l.variants = [], st.each(d = c.option("archivers").create || [], function (e, t) {
                    l.variants.push([t, c.mime2kind(t)])
                }), l.change()
            }), this.getstate = function (e) {
                var t, n, e = this.files(e),
                    i = e.length,
                    a = i && !c.isRoot(e[0]) && (c.file(e[0].phash) || {}).write;
                return a && 1 < c.searchStatus.state && (a = i === (n = !0, st.grep(e, function (e) {
                    return n = !(!n || !e.read || 0 !== e.hash.indexOf(t))
                }).length)) && (t = c.cwd().volumeid), a && !this._disabled && d.length && (i || s && "pending" == s.state()) ? 0 : -1
            }, this.exec = function (e, t) {
                var n, i = this.files(e),
                    a = i.length,
                    t = t || d[0],
                    o = c.file(i[0].phash) || null,
                    r = ["errArchive", "errPerm", "errCreatingTempDir", "errFtpDownloadFile", "errFtpUploadFile", "errFtpMkdir", "errArchiveExec", "errExtractExec", "errRm"];
                if (s = st.Deferred().fail(function (e) {
                    e && c.error(e)
                }), !a || !d.length || -1 === st.inArray(t, d)) return s.reject();
                if (!o.write) return s.reject(r);
                for (n = 0; n < a; n++)
                    if (!i[n].read) return s.reject(r);
                return l.mime = t, l.prefix = (1 < a ? "Archive" : i[0].name) + (c.option("archivers").createext ? "." + c.option("archivers").createext[t] : ""), l.data = {
                    targets: l.hashes(e),
                    type: t
                }, c.cwd().hash !== o.hash ? c.exec("open", o.hash).done(function () {
                    c.one("cwdrender", function () {
                        c.selectfiles({
                            files: e
                        }), s = st.proxy(c.res("mixin", "make"), l)()
                    })
                }) : (c.selectfiles({
                    files: e
                }), s = st.proxy(c.res("mixin", "make"), l)()), s
            }
        }, (Fe.prototype.commands.back = function () {
            this.alwaysEnabled = !0, this.updateOnSelect = !1, this.shortcuts = [{
                pattern: "ctrl+left backspace"
            }], this.getstate = function () {
                return this.fm.history.canBack() ? 0 : -1
            }, this.exec = function () {
                return this.fm.history.back()
            }
        }).prototype = {
            forceLoad: !0
        }, Fe.prototype.commands.chmod = function () {
            this.updateOnSelect = !1;

            function y(e) {
                return !isNaN(parseInt(e, 8)) && parseInt(e, 8) <= 511 || e.match(/^([r-][w-][x-]){3}$/i)
            }
            var e = this.fm,
                w = {
                    0: "owner",
                    1: "group",
                    2: "other"
                },
                x = {
                    read: e.i18n("read"),
                    write: e.i18n("write"),
                    execute: e.i18n("execute"),
                    perm: e.i18n("perm"),
                    kind: e.i18n("kind"),
                    files: e.i18n("files")
                };
            this.tpl = {
                main: '<div class="ui-helper-clearfix elfinder-info-title"><span class="elfinder-cwd-icon {class} ui-corner-all"></span>{title}</div>{dataTable}',
                itemTitle: '<strong>{name}</strong><span id="elfinder-info-kind">{kind}</span>',
                groupTitle: "<strong>{items}: {num}</strong>",
                dataTable: '<table id="{id}-table-perm"><tr><td>{0}</td><td>{1}</td><td>{2}</td></tr></table><div class="">' + x.perm + ': <input class="elfinder-tabstop elfinder-focus" id="{id}-perm" type="text" size="4" maxlength="3" value="{value}"></div>',
                fieldset: '<fieldset id="{id}-fieldset-{level}"><legend>{f_title}{name}</legend><input type="checkbox" value="4" class="elfinder-tabstop" id="{id}-read-{level}-perm"{checked-r}> <label for="{id}-read-{level}-perm">' + x.read + '</label><br><input type="checkbox" value="6" class="elfinder-tabstop" id="{id}-write-{level}-perm"{checked-w}> <label for="{id}-write-{level}-perm">' + x.write + '</label><br><input type="checkbox" value="5" class="elfinder-tabstop" id="{id}-execute-{level}-perm"{checked-x}> <label for="{id}-execute-{level}-perm">' + x.execute + "</label><br>"
            }, this.shortcuts = [{}], this.getstate = function (e) {
                var t = this.fm;
                return 0 == (e = e || t.selected()).length && (e = [t.cwd().hash]), this.checkstate(this.files(e)) ? 0 : -1
            }, this.checkstate = function (e) {
                var t, n = e.length;
                return !(!n || n !== (t = !0, st.grep(e, function (e) {
                    return t = !(!(t && e.isowner && e.perm && y(e.perm)) || 1 != n && "directory" == e.mime)
                }).length))
            }, this.exec = function (e) {
                var t, n = this.hashes(e),
                    e = this.files(n),
                    s = (e.length || (n = [this.fm.cwd().hash], e = this.files(n)), this.fm),
                    i = st.Deferred().always(function () {
                        s.enable()
                    }),
                    l = this.tpl,
                    a = e.length,
                    o = e[0],
                    r = s.namespace + "-perm-" + o.hash,
                    c = l.main,
                    d = ' checked="checked"',
                    p = function () {
                        var t, e = st.trim(st("#" + r + "-perm").val());
                        if (!y(e)) return !1;
                        g.elfinderdialog("close"), t = {
                            cmd: "chmod",
                            targets: n,
                            mode: e
                        }, s.request({
                            data: t,
                            notify: {
                                type: "chmod",
                                cnt: a
                            }
                        }).fail(function (e) {
                            i.reject(e)
                        }).done(function (e) {
                            e.changed && e.changed.length && (e.undo = {
                                cmd: "chmod",
                                callback: function () {
                                    var n = [];
                                    return st.each(v, function (e, t) {
                                        n.push(s.request({
                                            data: {
                                                cmd: "chmod",
                                                targets: t,
                                                mode: e
                                            },
                                            notify: {
                                                type: "undo",
                                                cnt: t.length
                                            }
                                        }))
                                    }), st.when.apply(null, n)
                                }
                            }, e.redo = {
                                cmd: "chmod",
                                callback: function () {
                                    return s.request({
                                        data: t,
                                        notify: {
                                            type: "redo",
                                            cnt: n.length
                                        }
                                    })
                                }
                            }), i.resolve(e)
                        })
                    },
                    u = function () {
                        for (var e, t = "", n = 0; n < 3; n++) e = 0, st("#" + r + "-read-" + w[n] + "-perm").is(":checked") && (e |= 4), st("#" + r + "-write-" + w[n] + "-perm").is(":checked") && (e |= 2), st("#" + r + "-execute-" + w[n] + "-perm").is(":checked") && (e |= 1), t += e.toString(8);
                        st("#" + r + "-perm").val(t)
                    },
                    h = function (e) {
                        return e ? ":" + e : ""
                    },
                    f = function (e) {
                        if (isNaN(parseInt(e, 8))) {
                            for (var t = e.split(""), n = [], i = 0, a = t.length; i < a; i++) 0 === i || 3 === i || 6 === i ? t[i].match(/[r]/i) ? n.push(1) : t[i].match(/[-]/) && n.push(0) : 1 === i || 4 === i || 7 === i ? t[i].match(/[w]/i) ? n.push(1) : t[i].match(/[-]/) && n.push(0) : t[i].match(/[x]/i) ? n.push(1) : t[i].match(/[-]/) && n.push(0);
                            n.splice(3, 0, ","), n.splice(7, 0, ",");
                            for (var o = n.join("").split(","), r = [], s = 0, l = o.length; s < l; s++) {
                                var c = parseInt(o[s], 2).toString(8);
                                r.push(c)
                            }
                            e = r.join("")
                        } else e = parseInt(e, 8).toString(8);
                        return e
                    },
                    m = {
                        title: this.title,
                        width: "auto",
                        buttons: ((m = {})[s.i18n("btnApply")] = p, m[s.i18n("btnCancel")] = function () {
                            g.elfinderdialog("close")
                        }, m),
                        close: function () {
                            st(this).elfinderdialog("destroy")
                        }
                    },
                    g = s.getUI().find("#" + r),
                    v = {},
                    b = "";
                return g.length ? (g.elfinderdialog("toTop"), st.Deferred().resolve()) : (c = c.replace("{class}", 1 < a ? "elfinder-cwd-icon-group" : s.mime2class(o.mime)), 1 < a ? t = l.groupTitle.replace("{items}", s.i18n("items")).replace("{num}", a) : (t = l.itemTitle.replace("{name}", o.name).replace("{kind}", s.mime2kind(o)), b = s.tmb(o)), o = function (e, t) {
                    for (var n, i, a = "", o = l.dataTable, r = 0; r < 3; r++) a += (n = parseInt(e.slice(r, r + 1), 8)).toString(8), i = l.fieldset.replace("{f_title}", s.i18n(w[r])).replace("{name}", h(t[w[r]])).replace(/\{level\}/g, w[r]), o = o.replace("{" + r + "}", i).replace("{checked-r}", 4 == (4 & n) ? d : "").replace("{checked-w}", 2 == (2 & n) ? d : "").replace("{checked-x}", 1 == (1 & n) ? d : "");
                    return o = o.replace("{value}", a).replace("{valueCaption}", x.perm)
                }(function (e) {
                    for (var t, n, i, a = "777", o = "", r = e.length, s = 0; s < r; s++) {
                        t = f(e[s].perm), v[t] || (v[t] = []), v[t].push(e[s].hash);
                        for (var o = "", l = 0; l < 3; l++) n = parseInt(t.slice(l, l + 1), 8), i = parseInt(a.slice(l, l + 1), 8), 4 != (4 & n) && 4 == (4 & i) && (i -= 4), 2 != (2 & n) && 2 == (2 & i) && (i -= 2), 1 != (1 & n) && 1 == (1 & i) && --i, o += i.toString(8);
                        a = o
                    }
                    return a
                }(e), 1 == e.length ? e[0] : {}), c = c.replace("{title}", t).replace("{dataTable}", o).replace(/{id}/g, r), (g = this.fmDialog(c, m)).attr("id", r), b && st("<img/>").on("load", function () {
                    g.find(".elfinder-cwd-icon").addClass(b.className).css("background-image", "url('" + b.url + "')")
                }).attr("src", b.url), st("#" + r + "-table-perm :checkbox").on("click", function () {
                    u("perm")
                }), st("#" + r + "-perm").on("keydown", function (e) {
                    e.keyCode == st.ui.keyCode.ENTER && (e.stopPropagation(), p())
                }).on("focus", function (e) {
                    st(this).trigger("select")
                }).on("keyup", function (e) {
                    if (3 == st(this).val().length) {
                        st(this).trigger("select");
                        for (var t, n = st(this).val(), i = 0; i < 3; i++) t = parseInt(n.slice(i, i + 1), 8), st("#" + r + "-read-" + w[i] + "-perm").prop("checked", !1), st("#" + r + "-write-" + w[i] + "-perm").prop("checked", !1), st("#" + r + "-execute-" + w[i] + "-perm").prop("checked", !1), 4 == (4 & t) && st("#" + r + "-read-" + w[i] + "-perm").prop("checked", !0), 2 == (2 & t) && st("#" + r + "-write-" + w[i] + "-perm").prop("checked", !0), 1 == (1 & t) && st("#" + r + "-execute-" + w[i] + "-perm").prop("checked", !0);
                        u()
                    }
                }), i)
            }
        }, Fe.prototype.commands.colwidth = function () {
            this.alwaysEnabled = !0, this.updateOnSelect = !1, this.getstate = function () {
                return "fixed" === this.fm.getUI("cwd").find("table").css("table-layout") ? 0 : -1
            }, this.exec = function () {
                return this.fm.getUI("cwd").trigger("colwidth"), st.Deferred().resolve()
            }
        }, Fe.prototype.commands.copy = function () {
            this.shortcuts = [{
                pattern: "ctrl+c ctrl+insert"
            }], this.getstate = function (e) {
                var t, e = this.files(e),
                    n = e.length;
                return n && (t = !0, st.grep(e, function (e) {
                    return t = !(!t || !e.read)
                }).length == n) ? 0 : -1
            }, this.exec = function (e) {
                var t = this.fm,
                    n = st.Deferred().fail(function (e) {
                        t.error(e)
                    });
                return st.each(this.files(e), function (e, t) {
                    if (!t.read) return !n.reject(["errCopy", t.name, "errPerm"])
                }), "rejected" == n.state() ? n : n.resolve(t.clipboard(this.hashes(e)))
            }
        }, Fe.prototype.commands.cut = function () {
            var i = this.fm;
            this.shortcuts = [{
                pattern: "ctrl+x shift+insert"
            }], this.getstate = function (e) {
                var t, e = this.files(e),
                    n = e.length;
                return n && (t = !0, st.grep(e, function (e) {
                    return t = !(!t || !e.read || e.locked || i.isRoot(e))
                }).length == n) ? 0 : -1
            }, this.exec = function (e) {
                var n = st.Deferred().fail(function (e) {
                    i.error(e)
                });
                return st.each(this.files(e), function (e, t) {
                    return !t.read || t.locked || i.isRoot(t) ? !n.reject(["errCopy", t.name, "errPerm"]) : t.locked ? !n.reject(["errLocked", t.name]) : void 0
                }), "rejected" == n.state() ? n : n.resolve(i.clipboard(this.hashes(e), !0))
            }
        }, Fe.prototype.commands.zipdl = function () { }, Fe.prototype.commands.download = function () {
            function x(e, n) {
                var i, a;
                if (null !== r && (1 < o.searchStatus.state ? z = o.searchStatus.mixed : o.leafRoots[o.cwd().hash] && (i = o.cwd().volumeid, st.each(e, function (e, t) {
                    if (0 !== t.indexOf(i)) return !(z = !0)
                })), C = o.isCommandEnabled("zipdl", e[0])), z) {
                    if (a = r ? "zipdl" : "download", !(e = st.grep(e, function (e) {
                        var t = o.file(e),
                            e = !(!t || !r && "directory" === t.mime || !o.isCommandEnabled(a, e));
                        return t && n && !e && o.cwdHash2Elm(t.hash).trigger("unselect"), e
                    })).length) return []
                } else if (!o.isCommandEnabled("download", e[0])) return [];
                return st.grep(k.files(e), function (e) {
                    var t = !(!e.read || !C && "directory" == e.mime);
                    return n && !t && o.cwdHash2Elm(e.hash).trigger("unselect"), t
                })
            }
            var k = this,
                o = this.fm,
                r = null,
                C = !1,
                z = !1,
                T = !1,
                A = window.location.pathname || "/";
            this.linkedCmds = ["zipdl"], this.shortcuts = [{
                pattern: "shift+enter"
            }], this.getstate = function (e) {
                var e = this.hashes(e),
                    t = e.length,
                    n = this.options.maxRequests || 10;
                return !(t < 1) && (t = x(e).length) && (C || t <= n && (!o.UA.IE && !o.UA.Mobile || 1 == t)) ? 0 : -1
            }, o.bind("contextmenu", function (e) {
                function n(i) {
                    var e = i.url || o.url(i.hash);
                    return {
                        icon: "link",
                        node: st("<a></a>").attr({
                            href: e,
                            target: "_blank",
                            title: o.i18n("link")
                        }).text(i.name).on("mousedown click touchstart touchmove touchend contextmenu", function (e) {
                            e.stopPropagation()
                        }).on("dragstart", function (e) {
                            var t, n, e = e.dataTransfer || e.originalEvent.dataTransfer || null;
                            r = null, e && (e.effectAllowed = "copyLink", e.setDragImage && (r = st('<div class="elfinder-drag-helper html5-native">').append((n = (t = i).mime, t = o.tmb(t), n = '<div class="elfinder-cwd-icon ' + o.mime2class(n) + ' ui-corner-all"></div>', n = t ? st(n).addClass(t.className).css("background-image", "url('" + t.url + "')").get(0).outerHTML : n)).appendTo(st(document.body)), e.setDragImage(r.get(0), 50, 47)), o.UA.IE || (e.setData("elfinderfrom", window.location.href + i.phash), e.setData("elfinderfrom:" + e.getData("elfinderfrom"), "")))
                        }).on("dragend", function (e) {
                            r && r.remove()
                        })
                    }
                }
                var i, a, o = k.fm,
                    r = null;
                k.extra = null, e.data && 1 === (e = e.data.targets || []).length && (i = o.file(e[0])) && "directory" !== i.mime && ("1" != i.url ? k.extra = n(i) : (k.extra = {
                    icon: "link",
                    node: st("<a></a>").attr({
                        href: "#",
                        title: o.i18n("getLink"),
                        draggable: "false"
                    }).text(i.name).on("click touchstart", function (e) {
                        var t;
                        "touchstart" === e.type && 1 < e.originalEvent.touches.length || (t = a.parent(), e.stopPropagation(), e.preventDefault(), t.removeClass("ui-state-disabled").addClass("elfinder-button-icon-spinner"), o.request({
                            data: {
                                cmd: "url",
                                target: i.hash
                            },
                            preventDefault: !0
                        }).always(function (e) {
                            t.removeClass("elfinder-button-icon-spinner"), e.url ? (o.file(i.hash).url = e.url, a.replaceWith(n(i).node)) : t.addClass("ui-state-disabled")
                        }))
                    })
                }, (a = k.extra.node).ready(function () {
                    requestAnimationFrame(function () {
                        a.parent().addClass("ui-state-disabled").css("pointer-events", "auto")
                    })
                })))
            }).one("open", function () {
                2.1012 <= o.api && (r = o.getCommand("zipdl")), T = o.cookieEnabled && 2.1038 < o.api && !o.isCORS
            }), this.exec = function (e) {
                function t(p) {
                    return function () {
                        var e, c, t, d = st.Deferred(),
                            n = f.file(f.root(p[0])),
                            i = 1 === p.length,
                            n = n ? n.i18 || n.name : null;
                        return i ? (e = f.file(p[0])) && (c = e.i18 || e.name) : (st.each(p, function () {
                            var e = f.file(this);
                            if (!e || t && t !== e.phash) return t = null, !1;
                            t = e.phash
                        }), t && (e = f.file(t)) && (c = (e.i18 || e.name) + "-" + p.length)), n = (n = c ? c : n) && " (" + n + ")", f.request({
                            data: {
                                cmd: "zipdl",
                                targets: p
                            },
                            notify: {
                                type: "zipdl",
                                cnt: 1,
                                hideCnt: !0,
                                msg: f.i18n("ntfzipdl") + n
                            },
                            cancel: !0,
                            eachCancel: !0,
                            preventDefault: !0
                        }).done(function (e) {
                            function t(e) {
                                i = st("<a></a>").attr("href", e).attr("download", f.escape(c)).on("click", function () {
                                    d.resolve(), n && n.elfinderdialog("destroy")
                                }), g ? (i.attr("target", "_blank").append('<span class="elfinder-button-icon elfinder-button-icon-download"></span>' + f.escape(c)), s[f.i18n("btnCancel")] = function () {
                                    n.elfinderdialog("destroy")
                                }, n = k.fmDialog(i, {
                                    title: f.i18n("link"),
                                    buttons: s,
                                    width: "200px",
                                    destroyOnClose: !0,
                                    close: function () {
                                        "resolved" !== d.state() && d.resolve()
                                    }
                                })) : (v(i.hide().appendTo("body").get(0)), i.remove())
                            }
                            var n, i, a, o, r, s = {},
                                l = "dlw" + +new Date;
                            e.error ? (f.error(e.error), d.resolve()) : e.zipdl && (e = e.zipdl, c ? (r = f.splitFileExtention(e.name || ""), c += r[1] ? "." + r[1] : ".zip") : c = e.name, h || g ? (u = f.options.url + (-1 === f.options.url.indexOf("?") ? "?" : "&") + "cmd=zipdl&download=1", st.each([p[0], e.file, c, e.mime], function (e, t) {
                                u += "&targets%5B%5D=" + encodeURIComponent(t)
                            }), st.each(f.customData, function (e, t) {
                                u += "&" + encodeURIComponent(e) + "=" + encodeURIComponent(t)
                            }), u += "&" + encodeURIComponent(c), f.hasParrotHeaders() ? f.getBinaryByUrl({
                                url: u
                            }, function (e) {
                                e instanceof Blob ? (u = (window.URL || window.webkitURL).createObjectURL(e), t(u)) : f.error(["errUploadTransfer", f.i18n("kindZIP")])
                            }) : t(u)) : (a = st('<form action="' + f.options.url + '" method="post" target="' + l + '" style="display:none"></form>').append('<input type="hidden" name="cmd" value="zipdl"/>').append('<input type="hidden" name="download" value="1"/>'), st.each([p[0], e.file, c, e.mime], function (e, t) {
                                a.append('<input type="hidden" name="targets[]" value="' + f.escape(t) + '"/>')
                            }), st.each(f.customData, function (e, t) {
                                a.append('<input type="hidden" name="' + e + '" value="' + f.escape(t) + '"/>')
                            }), a.attr("target", l).appendTo("body"), o = st('<iframe style="display:none" name="' + l + '">').appendTo("body").ready(function () {
                                a.submit().remove(), d.resolve(), setTimeout(function () {
                                    o.remove()
                                }, 2e4)
                            })))
                        }).fail(function (e) {
                            e && f.error(e), d.resolve()
                        }), d.promise()
                    }
                }
                var n, u, i, h, a, o, r, s, l, e = this.hashes(e),
                    f = this.fm,
                    c = (f.options.url, x(e, !0)),
                    d = st.Deferred(),
                    p = "",
                    m = {},
                    g = !1,
                    v = function (e) {
                        var t;
                        "function" == typeof MouseEvent ? t = new MouseEvent("click") : (t = document.createEvent("MouseEvents")).initMouseEvent("click", !0, !0, window, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), f.pauseUnloadCheck(!0), e.dispatchEvent(t)
                    },
                    b = function (e) {
                        var t = "elfdl" + e;
                        2 === document.cookie.split(t + "=").length ? (o && clearTimeout(o), document.cookie = t + "=; path=" + A + "; max-age=0", y()) : setTimeout(function () {
                            b(e)
                        }, 200)
                    },
                    y = function () {
                        f.ui.notify.children(".elfinder-notify-download").length && f.notify({
                            type: "download",
                            cnt: -1
                        })
                    },
                    w = [];
                if (!c.length) return d.reject();
                if (a = st.grep(c, function (e) {
                    return "directory" !== e.mime
                }).length, i = st("<a>").hide().appendTo("body"), h = "string" == typeof i.get(0).download, C && (a !== c.length || a >= (this.options.minFilesZipdl || 1))) return i.remove(), g = !h && f.UA.Mobile, z ? (m = {}, st.each(c, function (e, t) {
                    var n = t.hash.split("_", 2);
                    m[n[0]] ? m[n[0]].push(t.hash) : m[n[0]] = [t.hash]
                }), !g && f.UA.Mobile && 1 < Object.keys(m).length && (g = !0)) : m = [st.map(c, function (e) {
                    return e.hash
                })], d = f.sequence(st.map(m, t)).always(function () {
                    f.trigger("download", {
                        files: c
                    })
                });
                for (w = [], s = st.Deferred().done(function (e) {
                    for (n = 0; n < e.length; n++) u = e[n], T && u.substr(0, f.options.url.length) === f.options.url && (r = f.getRequestId(), w.push(r), u += "&cpath=" + A + "&reqid=" + r, o = setTimeout(function () {
                        f.notify({
                            type: "download",
                            cnt: 1,
                            cancel: f.UA.IE || f.UA.Edge ? void 0 : function () {
                                w.length && st.each(w, function () {
                                    f.request({
                                        data: {
                                            cmd: "abort",
                                            id: this
                                        },
                                        preventDefault: !0
                                    })
                                }), w = []
                            }
                        })
                    }, f.notifyDelay), b(r)), h ? v(i.attr("href", u).attr("download", f.escape(c[n].name)).get(0)) : f.UA.Mobile ? setTimeout(function () {
                        window.open(u) || (f.error("errPopup"), o && cleaerTimeout(o), y())
                    }, 100) : p += '<iframe class="downloader" id="downloader-' + c[n].hash + '" style="display:none" src="' + u + '"></iframe>';
                    i.remove(), st(p).appendTo("body").ready(function () {
                        setTimeout(function () {
                            st(p).each(function () {
                                st("#" + st(this).attr("id")).remove()
                            })
                        }, 2e4 + 1e4 * n)
                    }), f.trigger("download", {
                        files: c
                    }), d.resolve()
                }), a = c.length, l = [], n = 0; n < c.length; n++) f.openUrl(c[n].hash, !0, function (e) {
                    e && l.push(e), --a < 1 && s.resolve(l)
                });
                return d
            }
        }, Fe.prototype.commands.duplicate = function () {
            var i = this.fm;
            this.getstate = function (e) {
                var t, e = this.files(e),
                    n = e.length;
                return n && i.cwd().write && (t = !0, st.grep(e, function (e) {
                    return t = !(!t || !e.read || e.phash !== i.cwd().hash || i.isRoot(e))
                }).length == n) ? 0 : -1
            }, this.exec = function (e) {
                var n = this.fm,
                    t = this.files(e),
                    i = t.length,
                    a = st.Deferred().fail(function (e) {
                        e && n.error(e)
                    });
                return i ? (st.each(t, function (e, t) {
                    if (!t.read || !n.file(t.phash).write) return !a.reject(["errCopy", t.name, "errPerm"])
                }), "rejected" == a.state() ? a : n.request({
                    data: {
                        cmd: "duplicate",
                        targets: this.hashes(e)
                    },
                    notify: {
                        type: "copy",
                        cnt: i
                    },
                    navigate: {
                        toast: {
                            inbuffer: {
                                msg: n.i18n(["complete", n.i18n("cmdduplicate")])
                            }
                        }
                    }
                })) : a.reject()
            }
        }, Fe.prototype.commands.edit = function () {
            function c(e) {
                var t, n, i, a = e.length;
                return 1 < a && (t = e[0].mime, n = e[0].name.replace(/^.*(\.[^.]+)$/, "$1")), st.grep(e, function (e) {
                    return !i && "directory" !== e.mime && ((e = e.read && (l || S.mimeIsText(e.mime) || -1 !== st.inArray(e.mime, 1 === a ? r : s)) && (!j.onlyMimes.length || -1 !== st.inArray(e.mime, j.onlyMimes)) && (1 === a || e.mime === t && e.name.substr(-1 * n.length) === n) && !!S.uploadMimeCheck(e.mime, e.phash) && m(e, a) && Object.keys(f).length) || (i = !0), e)
                })
            }

            function d() {
                var e = S.storage("useStoredEditor");
                return e ? 0 < e : j.options.useStoredEditor
            }

            function p(n, i) {
                var a = [];
                return st.each(f, function (e, t) {
                    a.push({
                        label: S.escape(t.i18n),
                        icon: t.info && t.info.icon ? t.info.icon : "edit",
                        options: {
                            iconImg: t.info && t.info.iconImg ? S.baseUrl + t.info.iconImg : void 0
                        },
                        callback: function () {
                            g(n[0].mime, t), i && i.call(t)
                        }
                    })
                }), a
            }

            function u(e) {
                return (e = n[e]) && Object.keys(f).length ? f[i(e)] : void 0
            }
            var n, j = this,
                S = this.fm,
                O = S.res("class", "editing"),
                r = [],
                s = [],
                l = !1,
                I = function (e) {
                    return e.replace(/\s+$/, "")
                },
                M = function (e) {
                    var n, i = st('<select class="ui-corner-all"></select>');
                    return e && st.each(e, function (e, t) {
                        n = S.escape(t.value), i.append('<option value="' + n + '">' + (t.caption ? S.escape(t.caption) : n) + "</option>")
                    }), st.each(j.options.encodings, function (e, t) {
                        i.append('<option value="' + t + '">' + t + "</option>")
                    }), i
                },
                E = function () {
                    var e = S.options.dialogContained ? S.getUI() : st(window),
                        t = "string" == typeof j.options.dialogWidth && (t = j.options.dialogWidth.match(/(\d+)%/)) ? parseInt(e.width() * (t[1] / 100)) : parseInt(j.options.dialogWidth || 650);
                    return Math.min(t, e.width())
                },
                D = function () {
                    var e, t;
                    if (j.options.dialogHeight) return e = S.options.dialogContained ? S.getUI() : st(window), t = "string" == typeof j.options.dialogHeight && (t = j.options.dialogHeight.match(/(\d+)%/)) ? parseInt(e.height() * (t[1] / 100)) : parseInt(j.options.dialogHeight || e.height()), Math.min(t, e.height())
                },
                F = function (e) {
                    var t, n = S.file(e);
                    S.request({
                        cmd: "info",
                        targets: [e],
                        preventDefault: !0
                    }).done(function (e) {
                        e && e.files && e.files.length && (t = e.files[0], n.ts == t.ts && n.size == t.size || (S.updateCache(e = {
                            changed: [t]
                        }), S.change(e)))
                    })
                },
                h = function (n, s, i, a, o, e) {
                    function r() {
                        e && Array.isArray(e) && st.each(e, function () {
                            this.msg && S.toast(this)
                        })
                    }

                    function l() {
                        var e, t, n, i = v ? v.val() : void 0,
                            a = st.Deferred().fail(function (e) {
                                g.show().find("button.elfinder-btncnt-0,button.elfinder-btncnt-1").hide()
                            });
                        return x() ? (f.editor && (f.editor.save(f[0], f.editor.instance), (e = f.editor.confObj).info && (e.info.schemeContent || e.info.arrayBufferContent) && (i = "scheme")), t = C(), z(t), t.promise ? (n = setTimeout(function () {
                            S.notify({
                                type: "chkcontent",
                                cnt: 1,
                                hideCnt: !0,
                                cancel: function () {
                                    t.reject()
                                }
                            })
                        }, 100), t.always(function () {
                            n && clearTimeout(n), S.notify({
                                type: "chkcontent",
                                cnt: -1
                            })
                        }).done(function (e) {
                            y.notifyWith(f, [i, f.data("hash"), m, a])
                        }).fail(function (e) {
                            a.reject(e)
                        })) : y.notifyWith(f, [i, f.data("hash"), m, a]), a) : a.resolve()
                    }

                    function c() {
                        x() && l().fail(function (e) {
                            e && S.error(e)
                        })
                    }

                    function d() {
                        f.elfinderdialog("close")
                    }

                    function t() {
                        x() && (g.hide(), l().done(function () {
                            w = !1, g.show(), d()
                        }).fail(function (e) {
                            g.show(), e && S.error(e)
                        }))
                    }

                    function p() {
                        var t, e, n, i, a, o, r;
                        x() && (t = m, e = s.phash, n = function (e) {
                            r.addClass(O).fadeIn(function () {
                                e && S.error(e)
                            }), m = t, S.disable()
                        }, i = function () {
                            j.mime = A.mime || s.mime, j.prefix = (A.name || s.name).replace(/ \d+(\.[^.]+)?$/, "$1"), j.requestCmd = "mkfile", j.nextAction = {}, j.data = {
                                target: e
                            }, st.proxy(S.res("mixin", "make"), j)().done(function (e) {
                                var t;
                                e.added && e.added.length ? (t = f.data("hash"), f.data("hash", e.added[0].hash), l().done(function () {
                                    w = !1, g.show(), d(), r.fadeIn()
                                }).fail(function () {
                                    S.exec("rm", [e.added[0].hash], {
                                        forceRm: !0,
                                        quiet: !0
                                    }), f.data("hash", t), g.find("button.elfinder-btncnt-2").hide(), n()
                                })) : n()
                            }).progress(function (e) {
                                e && "errUploadMime" === e && f.trigger("saveAsFail")
                            }).fail(n).always(function () {
                                delete j.mime, delete j.prefix, delete j.nextAction, delete j.data
                            }), S.trigger("unselectfiles", {
                                files: [s.hash]
                            })
                        }, o = a = null, r = S.getUI().children("." + j.dialogClass + ":visible"), (r = g.is(":hidden") ? r.add(g) : r).removeClass(O).fadeOut(), S.enable(), S.searchStatus.state < 2 && e !== S.cwd().hash ? a = S.exec("open", [e], {
                            thash: e
                        }) : S.file(e) || (o = S.request({
                            cmd: "info",
                            targets: [e]
                        })), st.when([a, o]).done(function () {
                            o ? S.one("infodone", function () {
                                S.file(e) ? i() : n("errFolderNotFound")
                            }) : a ? S.one("cwdrender", i) : i()
                        }).fail(n))
                    }

                    function u() {
                        var e, t, n = st.Deferred();
                        return w ? (f.editor && f.editor.save(f[0], f.editor.instance), (e = C()) && e.promise ? (t = setTimeout(function () {
                            S.notify({
                                type: "chkcontent",
                                cnt: 1,
                                hideCnt: !0,
                                cancel: function () {
                                    e.reject()
                                }
                            })
                        }, 100), e.always(function () {
                            t && clearTimeout(t), S.notify({
                                type: "chkcontent",
                                cnt: -1
                            })
                        }).done(function (e) {
                            n.resolve(m !== e)
                        }).fail(function (e) {
                            n.resolve(e || void 0 !== m)
                        })) : n.resolve(m !== e), n) : n.resolve(!1)
                    }

                    function h() {
                        v && u().done(function (e) {
                            e ? v.attr("title", S.i18n("saveAsEncoding")).addClass("elfinder-edit-changed") : v.attr("title", S.i18n("openAsEncoding")).removeClass("elfinder-edit-changed")
                        })
                    }
                    var f, m, g, v, b, y = st.Deferred(),
                        w = !1,
                        x = function () {
                            return !!w || (S.toast({
                                mode: "warning",
                                msg: S.i18n("nowLoading")
                            }), !1)
                        },
                        k = {
                            title: S.escape(s.name),
                            width: E(),
                            height: D(),
                            buttons: {},
                            cssClass: O,
                            maxWidth: "window",
                            maxHeight: "window",
                            allowMinimize: !0,
                            allowMaximize: !0,
                            openMaximized: P() || o && o.info && o.info.openMaximized,
                            btnHoverFocus: !1,
                            closeOnEscape: !1,
                            propagationEvents: ["mousemove", "mouseup", "click"],
                            minimize: function () {
                                var e;
                                f.editor && g.closest(".ui-dialog").is(":hidden") && (e = f.editor.confObj).info && e.info.syncInterval && F(s.hash)
                            },
                            close: function () {
                                function n() {
                                    var e;
                                    y.resolve(), f.editor && (f.editor.close(f[0], f.editor.instance), (e = f.editor.confObj).info && e.info.syncInterval && F(s.hash)), f.elfinderdialog("destroy")
                                }
                                var i = void 0 !== A.name,
                                    a = i ? {
                                        label: "btnSaveAs",
                                        callback: function () {
                                            requestAnimationFrame(p)
                                        }
                                    } : {
                                        label: "btnSaveClose",
                                        callback: function () {
                                            l().done(function () {
                                                n()
                                            })
                                        }
                                    };
                                u().done(function (e) {
                                    var t = ["confirmNotSave"];
                                    e ? ("string" == typeof e && t.unshift(e), S.confirm({
                                        title: j.title,
                                        text: t,
                                        accept: a,
                                        cancel: {
                                            label: "btnClose",
                                            callback: n
                                        },
                                        buttons: i ? null : [{
                                            label: "btnSaveAs",
                                            callback: function () {
                                                requestAnimationFrame(p)
                                            }
                                        }]
                                    })) : n()
                                })
                            },
                            open: function () {
                                var e, t;
                                if (f.initEditArea.call(f, n, s, i, S), f.editor) {
                                    if ((e = f.editor.load(f[0]) || null) && e.done) e.always(function () {
                                        w = !0
                                    }).done(function (e) {
                                        f.editor.instance = e, f.editor.focus(f[0], f.editor.instance), z(C()), requestAnimationFrame(function () {
                                            g.trigger("resize")
                                        })
                                    }).fail(function (e) {
                                        e && S.error(e), f.elfinderdialog("destroy")
                                    }).always(r);
                                    else {
                                        if (w = !0, e && ("string" == typeof e || Array.isArray(e))) return S.error(e), void f.elfinderdialog("destroy");
                                        f.editor.instance = e, f.editor.focus(f[0], f.editor.instance), z(C()), requestAnimationFrame(function () {
                                            g.trigger("resize")
                                        }), r()
                                    } (e = f.editor.confObj).info && e.info.syncInterval && (t = parseInt(e.info.syncInterval)) && setTimeout(function () {
                                        T(t)
                                    }, t)
                                } else w = !0, z(C())
                            },
                            resize: function (e, t) {
                                f.editor && f.editor.resize(f[0], f.editor.instance, e, t || {})
                            }
                        },
                        C = function () {
                            var e = f.getContent.call(f, f[0]);
                            return e = void 0 !== e && !1 !== e && null !== e ? e : st.Deferred().reject()
                        },
                        z = function (e) {
                            e && e.promise ? e.done(function (e) {
                                m = e
                            }) : m = e
                        },
                        T = function (e) {
                            g.is(":visible") && (F(s.hash), setTimeout(function () {
                                T(e)
                            }, e))
                        },
                        A = {};
                    if (o && (o.html && (f = st(o.html)), b = {
                        init: o.init || null,
                        load: o.load,
                        getContent: o.getContent || null,
                        save: o.save,
                        beforeclose: "function" == typeof o.beforeclose ? o.beforeclose : void 0,
                        close: "function" == typeof o.close ? o.close : function () { },
                        focus: "function" == typeof o.focus ? o.focus : function () { },
                        resize: "function" == typeof o.resize ? o.resize : function () { },
                        instance: null,
                        doSave: c,
                        doCancel: d,
                        doClose: t,
                        file: s,
                        fm: S,
                        confObj: o,
                        trigger: function (e, t) {
                            S.trigger("editEditor" + e, Object.assign({}, o.info || {}, t))
                        }
                    }), !f) {
                        if (!S.mimeIsText(s.mime)) return y.reject("errEditorNotFound");
                        f = st('<textarea class="elfinder-file-edit" rows="20" id="' + n + '-ta"></textarea>').on("input propertychange", h), o && o.info && !o.info.useTextAreaEvent || f.on("keydown", function (e) {
                            var t, n, i = e.keyCode;
                            e.stopPropagation(), i == st.ui.keyCode.TAB && (e.preventDefault(), this.setSelectionRange && (t = this.value, n = this.selectionStart, this.value = t.substr(0, n) + "\t" + t.substr(this.selectionEnd), this.setSelectionRange(n += 1, n))), (e.ctrlKey || e.metaKey) && (i != "Q".charCodeAt(0) && i != "W".charCodeAt(0) || (e.preventDefault(), d()), i == "S".charCodeAt(0) && (e.preventDefault(), c()))
                        }).on("mouseenter", function () {
                            this.focus()
                        }), f.initEditArea = function (e, t, n) {
                            f.hide().val(n), this._setupSelEncoding(n)
                        }
                    }
                    return f._setupSelEncoding = function (e) {
                        function t(e) {
                            e && i.appendTo(v.parent()), i.empty().append(st("<option></option>").text(v.val())), v.width(i.width())
                        }
                        var n = a && "unknown" !== a ? [{
                            value: a
                        }] : [],
                            i = st("<select></select>").hide();
                        "" !== e && a && "UTF-8" === a || n.push({
                            value: "UTF-8"
                        }), v = M(n).on("touchstart", function (e) {
                            e.stopPropagation()
                        }).on("change", function () {
                            u().done(function (e) {
                                e || "" === C() || (d(), U(s, v.val(), o).fail(function (e) {
                                    e && S.error(e)
                                }))
                            }), t()
                        }).on("mouseover", h), f.parent().next().prepend(st('<div class="ui-dialog-buttonset elfinder-edit-extras"></div>').append(v)), t(!0)
                    }, f.data("hash", s.hash), b && ("function" == typeof (f.editor = b).beforeclose && (k.beforeclose = function () {
                        return b.beforeclose(f[0], b.instance)
                    }), "function" == typeof b.init && (f.initEditArea = b.init), "function" == typeof b.getContent && (f.getContent = b.getContent)), f.initEditArea || (f.initEditArea = function () { }), f.getContent || (f.getContent = function () {
                        return I(f.val())
                    }), o && o.info && o.info.preventGet || (k.buttons[S.i18n("btnSave")] = c, k.buttons[S.i18n("btnSaveClose")] = t, k.buttons[S.i18n("btnSaveAs")] = p, k.buttons[S.i18n("btnCancel")] = d), o && "function" == typeof o.prepare && o.prepare(f, k, s), g = j.fmDialog(f, k).attr("id", n).on("keydown keyup keypress", function (e) {
                        e.stopPropagation()
                    }).css({
                        overflow: "hidden",
                        minHeight: "7em"
                    }).addClass("elfinder-edit-editor").closest(".ui-dialog").on("changeType", function (e, t) {
                        var n;
                        t.extention && t.mime && (t.extention, t.mime, (n = st(this).children(".ui-dialog-buttonpane").children(".ui-dialog-buttonset")).children(".elfinder-btncnt-0,.elfinder-btncnt-1").hide(), A.name = S.splitFileExtention(s.name)[0] + "." + t.extention, A.mime = t.mime, t.keepEditor || n.children(".elfinder-btncnt-2").trigger("click"))
                    }), k = (S.options.dialogContained ? S.getUI() : st(window)).width(), g.width() > k && g.width(k), y.promise()
                },
                U = function (a, e, t) {
                    var o, n, r = a.hash,
                        s = (S.options, st.Deferred()),
                        l = "edit-" + S.namespace + "-" + a.hash,
                        i = S.getUI().find("#" + l),
                        e = e || 0;
                    if (i.length) return i.elfinderdialog("toTop"), s.resolve();
                    if (!(a.read && (a.write || t.info && t.info.converter))) return i = ["errOpen", a.name, "errPerm"], s.reject(i);
                    if (t && t.info) {
                        if ("function" == typeof t.info.edit) return (i = t.info.edit.call(S, a, t)).promise ? i.done(function () {
                            s.resolve()
                        }).fail(function (e) {
                            s.reject(e)
                        }) : i ? s.resolve() : s.reject(), s;
                        o = t.info.preventGet || t.info.noContent, t.info.urlAsContent || o ? (n = st.Deferred(), t.info.urlAsContent ? S.url(r, {
                            async: !0,
                            onetime: !0,
                            temporary: !0
                        }).done(function (e) {
                            n.resolve({
                                content: e
                            })
                        }) : n.resolve({})) : (e && (a.encoding = e, S.cache(a, "change")), n = S.request({
                            data: {
                                cmd: "get",
                                target: r,
                                conv: e,
                                _t: a.ts
                            },
                            options: {
                                type: "get",
                                cache: !0
                            },
                            notify: {
                                type: "file",
                                cnt: 1
                            },
                            preventDefault: !0
                        })), n.done(function (n) {
                            var i, e;
                            n.doconv ? S.confirm({
                                title: j.title,
                                text: "unknown" === n.doconv ? "confirmNonUTF8" : "confirmConvUTF8",
                                accept: {
                                    label: "btnConv",
                                    callback: function () {
                                        s = U(a, i.val(), t)
                                    }
                                },
                                cancel: {
                                    label: "btnCancel",
                                    callback: function () {
                                        s.reject()
                                    }
                                },
                                optionsCallback: function (e) {
                                    e.create = function () {
                                        var e = st('<div class="elfinder-dialog-confirm-encoding"></div>'),
                                            t = {
                                                value: n.doconv
                                            };
                                        "unknown" === n.doconv && (t.caption = "-"), i = M([t]), st(this).next().find(".ui-dialog-buttonset").prepend(e.append(st("<label>" + S.i18n("encoding") + " </label>").append(i)))
                                    }
                                }
                            }) : (!o && S.mimeIsText(a.mime) && (e = new RegExp("^(data:" + a.mime.replace(/([.+])/g, "\\$1") + ";base64,)", "i"), t.info.dataScheme ? window.btoa && !n.content.match(e) && (n.content = "data:" + a.mime + ";base64," + btoa(n.content)) : window.atob && (e = n.content.match(e)) && (n.content = atob(n.content.substr(e[1].length)))), h(l, a, n.content, n.encoding, t, n.toasts).done(function (e) {
                                s.resolve(e)
                            }).progress(function (e, t, n, i) {
                                var a = this;
                                t && (r = t), S.request({
                                    options: {
                                        type: "post"
                                    },
                                    data: {
                                        cmd: "put",
                                        target: r,
                                        encoding: e || n.encoding,
                                        content: n
                                    },
                                    notify: {
                                        type: "save",
                                        cnt: 1
                                    },
                                    syncOnFail: !0,
                                    preventFail: !0,
                                    navigate: {
                                        target: "changed",
                                        toast: {
                                            inbuffer: {
                                                msg: S.i18n(["complete", S.i18n("btnSave")])
                                            }
                                        }
                                    }
                                }).fail(function (e) {
                                    s.reject(e), i.reject()
                                }).done(function (e) {
                                    requestAnimationFrame(function () {
                                        a.trigger("focus"), a.editor && a.editor.focus(a[0], a.editor.instance)
                                    }), i.resolve()
                                })
                            }).fail(function (e) {
                                s.reject(e)
                            }))
                        }).fail(function (e) {
                            var t = S.parseError(e),
                                t = Array.isArray(t) ? t[0] : t;
                            a.encoding && (a.encoding = "", S.cache(a, "change")), "errConvUTF8" !== t && S.sync(), s.reject(e)
                        })
                    }
                    return s.promise()
                },
                f = {},
                t = {
                    info: {
                        id: "textarea",
                        name: "TextArea",
                        useTextAreaEvent: !0
                    },
                    load: function (e) {
                        this.trigger("Prepare", {
                            node: e,
                            editorObj: void 0,
                            instance: void 0,
                            opts: {}
                        }), e.setSelectionRange && e.setSelectionRange(0, 0), st(e).trigger("focus").show()
                    },
                    save: function () { }
                },
                m = function (i, a) {
                    var e = j.options.editors || [],
                        o = S.cwd().write;
                    return n = S.storage("storedEditors") || {}, f = {}, e.length || (e = [t]), st.each(e, function (e, t) {
                        var n;
                        (1 === a || !t.info.single) && (t.info && t.info.converter ? o : i.write) && (0 < i.size || !t.info.converter && !1 !== t.info.canMakeEmpty && S.mimesCanMakeEmpty[i.mime]) && (!t.info.maxSize || i.size <= t.info.maxSize) && function (e, t) {
                            if (t) {
                                if ("*" === t[0] || -1 !== st.inArray(e, t)) return !0;
                                for (var n = t.length, i = 0; i < n; i++)
                                    if (0 === e.indexOf(t[i])) return !0;
                                return !1
                            }
                            return S.mimeIsText(e)
                        }(i.mime, t.mimes || null) && function (e, t) {
                            if (!t || !t.length) return !0;
                            for (var n = e.replace(/^.+\.([^.]+)|(.+)$/, "$1$2").toLowerCase(), i = t.length, a = 0; a < i; a++)
                                if (n === t[a].toLowerCase()) return !0;
                            return !1
                        }(i.name, t.exts || null) && "function" == typeof t.load && "function" == typeof t.save && (n = t.info.name || "Editor " + e, t.id = t.info.id || "editor" + e, t.name = n, t.i18n = S.i18n(n), f[t.id] = t)
                    }), !!Object.keys(f).length
                },
                g = function (e, t) {
                    e && t && ((n = st.isPlainObject(n) ? n : {})[e] = t.id, S.storage("storedEditors", n), S.trigger("selectfiles", {
                        files: S.selected()
                    }))
                },
                P = function () {
                    var e = S.storage("editorMaximized");
                    return e ? 0 < e : j.options.editorMaximized
                },
                i = function (e) {
                    return e.toLowerCase().replace(/ +/g, "")
                };
            this.getEncSelect = M, this.shortcuts = [{
                pattern: "ctrl+e"
            }], this.init = function () {
                var t, a = this,
                    o = this.fm,
                    n = this.options,
                    i = [];
                this.onlyMimes = this.options.mimes || [], o.one("open", function () {
                    n.editors && Array.isArray(n.editors) && (o.trigger("canMakeEmptyFile", {
                        mimes: Object.keys(o.storage("mkfileTextMimes") || {}).concat(n.makeTextMimes || ["text/plain"])
                    }), st.each(n.editors, function (e, t) {
                        t.info && t.info.cmdCheck && i.push(t.info.cmdCheck)
                    }), (i.length ? 2.103 <= o.api ? o.request({
                        data: {
                            cmd: "editor",
                            name: i,
                            method: "enabled"
                        },
                        preventDefault: !0
                    }).done(function (e) {
                        t = e
                    }).fail(function () {
                        t = {}
                    }) : (t = {}, st.Deferred().resolve()) : st.Deferred().resolve()).always(function () {
                        t && (n.editors = st.grep(n.editors, function (e) {
                            return !e.info || !e.info.cmdCheck || !!t[e.info.cmdCheck]
                        })), st.each(n.editors, function (e, t) {
                            t.setup && "function" == typeof t.setup && t.setup.call(t, n, o), t.disabled || (t.mimes && Array.isArray(t.mimes) && (r = r.concat(t.mimes), t.info && t.info.single || (s = s.concat(t.mimes))), !l && t.mimes && "*" === t.mimes[0] && (l = !0), t.info || (t.info = {}), t.info.integrate && o.trigger("helpIntegration", Object.assign({
                                cmd: "edit"
                            }, t.info.integrate)), t.info.canMakeEmpty && o.trigger("canMakeEmptyFile", {
                                mimes: Array.isArray(t.info.canMakeEmpty) ? t.info.canMakeEmpty : t.mimes
                            }))
                        }), r = (st.uniqueSort || st.unique)(r), s = (st.uniqueSort || st.unique)(s), n.editors = st.grep(n.editors, function (e) {
                            return !e.disabled
                        })
                    }))
                }).bind("select", function () {
                    f = null
                }).bind("contextmenucreate", function (e) {
                    function t(e) {
                        var t = a.title;
                        o.one("contextmenucreatedone", function () {
                            a.title = t
                        }), a.title = o.escape(e.i18n), e.info && e.info.iconImg && (a.contextmenuOpts = {
                            iconImg: o.baseUrl + e.info.iconImg
                        }), delete a.variants
                    }
                    var n;
                    a.contextmenuOpts = void 0, "files" === e.data.type && a.enabled() && (n = o.file(e.data.targets[0]), m(n, e.data.targets.length) && (1 < Object.keys(f).length ? d() && (e = u(n.mime)) ? (t(e), a.extra = {
                        icon: "menu",
                        node: st("<span></span>").attr({
                            title: o.i18n("select")
                        }).on("click touchstart", function (e) {
                            var t;
                            "touchstart" === e.type && 1 < e.originalEvent.touches.length || (t = st(this), e.stopPropagation(), e.preventDefault(), o.trigger("contextmenu", {
                                raw: p(o.selectedFiles(), function () {
                                    var e = o.selected();
                                    o.exec("edit", e, {
                                        editor: this
                                    }), o.trigger("selectfiles", {
                                        files: e
                                    })
                                }),
                                x: t.offset().left,
                                y: t.offset().top
                            }))
                        })
                    }) : (delete a.extra, a.variants = [], st.each(f, function (e, t) {
                        a.variants.push([{
                            editor: t
                        }, t.i18n, t.info && t.info.iconImg ? o.baseUrl + t.info.iconImg : "edit"])
                    })) : (t(f[Object.keys(f)[0]]), delete a.extra)))
                }).bind("canMakeEmptyFile", function (e) {
                    var n, i;
                    e.data && e.data.resetTexts && (n = o.arrayFlip(a.options.makeTextMimes || ["text/plain"]), i = a.getMkfileHides(), st.each(o.storage("mkfileTextMimes") || {}, function (e, t) {
                        n[e] || (delete o.mimesCanMakeEmpty[e], delete i[e])
                    }), o.storage("mkfileTextMimes", null), Object.keys(i).length ? o.storage("mkfileHides", i) : o.storage("mkfileHides", null))
                })
            }, this.getstate = function (e) {
                var e = this.files(e),
                    t = e.length;
                return t && c(e).length == t ? 0 : -1
            }, this.exec = function (e, t) {
                var n, i, a = this.fm,
                    o = c(this.files(e)),
                    e = st.map(o, function (e) {
                        return e.hash
                    }),
                    r = [],
                    s = t && t.editor ? t.editor : null,
                    t = st(t && t._currentNode ? t._currentNode : a.cwdHash2Elm(e[0])),
                    l = st.Deferred();
                return null === f && m(o[0], e.length), t.length || (t = a.getUI("cwd")), i = st.Deferred(), (!s && 1 < Object.keys(f).length ? d() && (s = u(o[0].mime)) ? i.resolve(s) : (a.trigger("contextmenu", {
                    raw: p(o, function () {
                        i.resolve(this)
                    }),
                    x: t.offset().left,
                    y: t.offset().top + 22,
                    opened: function () {
                        a.one("closecontextmenu", function () {
                            requestAnimationFrame(function () {
                                "pending" === i.state() && i.reject()
                            })
                        })
                    }
                }), a.trigger("selectfiles", {
                    files: e
                }), i) : (1 < Object.keys(f).length && s && g(o[0].mime, s), i.resolve(s || (Object.keys(f).length ? f[Object.keys(f)[0]] : null)))).done(function (e) {
                    for (; n = o.shift();) r.push(U(n, n.encoding || void 0, e).fail(function (e) {
                        e && a.error(e)
                    }));
                    r.length ? st.when.apply(null, r).done(function () {
                        l.resolve()
                    }).fail(function () {
                        l.reject()
                    }) : l.reject()
                }).fail(function () {
                    l.reject()
                }), l
            }, this.getMkfileHides = function () {
                return S.storage("mkfileHides") || S.arrayFlip(j.options.mkfileHideMimes || [])
            }
        }, Fe.prototype.commands.empty = function () {
            function s(e) {
                return e = (e = t.files(e)).length ? e : [l.cwd()]
            }
            var t, l;
            this.linkedCmds = ["rm"], this.init = function () {
                l = (t = this).fm
            }, this.getstate = function (e) {
                var t, e = s(e),
                    n = e.length;
                return t = !0, st.grep(e, function (e) {
                    return t = !!(t && e.read && e.write && "directory" === e.mime)
                }).length == n ? 0 : -1
            }, this.exec = function (e) {
                function o(e) {
                    "number" == typeof e ? (a.push(i[e].name), delete i[e].dirs) : e && l.error(e), --r < 1 && t[a.length ? "resolve" : "reject"]()
                }
                var i = s(e),
                    r = i.length,
                    t = st.Deferred().done(function () {
                        var n = {
                            changed: {}
                        };
                        l.toast({
                            msg: l.i18n(['"' + a.join('", ') + '"', "complete", l.i18n("cmdempty")])
                        }), st.each(i, function (e, t) {
                            n.changed[t.hash] = t
                        }), l.change(n)
                    }).always(function () {
                        var t = l.cwd().hash;
                        l.trigger("selectfiles", {
                            files: st.map(i, function (e) {
                                return t === e.phash ? e.hash : null
                            })
                        })
                    }),
                    a = [];
                return st.each(i, function (t, i) {
                    var a;
                    return i.write && "directory" === i.mime ? l.isCommandEnabled("rm", i.hash) ? (a = setTimeout(function () {
                        l.notify({
                            type: "search",
                            cnt: 1,
                            hideCnt: !(1 < r)
                        })
                    }, l.notifyDelay), void l.request({
                        data: {
                            cmd: "open",
                            target: i.hash
                        },
                        preventDefault: !0,
                        asNotOpen: !0
                    }).done(function (e) {
                        var n = [];
                        a && clearTimeout(a), l.ui.notify.children(".elfinder-notify-search").length && l.notify({
                            type: "search",
                            cnt: -1,
                            hideCnt: !(1 < r)
                        }), e && e.files && e.files.length ? e.files.length > l.maxTargets ? o(["errEmpty", i.name, "errMaxTargets", l.maxTargets]) : (l.updateCache(e), st.each(e.files, function (e, t) {
                            if (!t.write || t.locked) return o(["errEmpty", i.name, "errRm", t.name, "errPerm"]), !(n = []);
                            n.push(t.hash)
                        }), n.length && l.exec("rm", n, {
                            _userAction: !0,
                            addTexts: [l.i18n("folderToEmpty", i.name)]
                        }).fail(function (e) {
                            l.trigger("unselectfiles", {
                                files: l.selected()
                            }), o(l.parseError(e) || "")
                        }).done(function () {
                            o(t)
                        })) : (l.toast({
                            mode: "warning",
                            msg: l.i18n("filderIsEmpty", i.name)
                        }), o(""))
                    }).fail(function (e) {
                        o(l.parseError(e) || "")
                    })) : (o(["errCmdNoSupport", '"rm"']), null) : (o(["errEmpty", i.name, "errPerm"]), null)
                }), t
            }
        }, Fe.prototype.commands.extract = function () {
            var e = this,
                y = e.fm,
                o = [];
            this.variants = [], this.disableOnSearch = !0, y.bind("open reload", function () {
                o = y.option("archivers").extract || [], 2 < y.api ? e.variants = [
                    [{
                        makedir: !0
                    }, y.i18n("cmdmkdir")],
                    [{}, y.i18n("btnCwd")]
                ] : e.variants = [
                    [{}, y.i18n("btnCwd")]
                ], e.change()
            }), this.getstate = function (e) {
                var n, i, t, e = this.files(e),
                    a = e.length;
                return a && (t = !0, st.grep(e, function (e) {
                    return t = !(!t || !e.read || -1 === st.inArray(e.mime, o))
                }).length == a) ? 0 < y.searchStatus.state ? (n = this.fm.cwd().hash, st.each(e, function (e, t) {
                    return i = t.phash === n
                }), i ? 0 : -1) : this.fm.cwd().write ? 0 : -1 : -1
            }, this.exec = function (e, t) {
                var r, n, s, e = this.files(e),
                    l = st.Deferred(),
                    c = e.length,
                    d = t && t.makedir ? 1 : 0,
                    p = !1,
                    u = !1,
                    h = 0,
                    t = y.files(e[0].phash),
                    f = [],
                    m = {},
                    g = (st.each(t, function (e, t) {
                        m[t.name] = t, f.push(t.name)
                    }), function (e) {
                        switch (e) {
                            case "overwrite_all":
                                p = !0;
                                break;
                            case "omit_all":
                                u = !0
                        }
                    }),
                    v = function (e) {
                        e.read && y.file(e.phash).write ? -1 === st.inArray(e.mime, o) ? (n = ["errExtract", e.name, "errNoArchive"], y.error(n), l.reject(n)) : y.request({
                            data: {
                                cmd: "extract",
                                target: e.hash,
                                makedir: d
                            },
                            notify: {
                                type: "extract",
                                cnt: 1
                            },
                            syncOnFail: !0,
                            navigate: {
                                toast: d ? {
                                    incwd: {
                                        msg: y.i18n(["complete", y.i18n("cmdextract")]),
                                        action: {
                                            cmd: "open",
                                            msg: "cmdopen"
                                        }
                                    },
                                    inbuffer: {
                                        msg: y.i18n(["complete", y.i18n("cmdextract")]),
                                        action: {
                                            cmd: "open",
                                            msg: "cmdopen"
                                        }
                                    }
                                } : {
                                    inbuffer: {
                                        msg: y.i18n(["complete", y.i18n("cmdextract")])
                                    }
                                }
                            }
                        }).fail(function (e) {
                            "rejected" != l.state() && l.reject(e)
                        }).done(function () { }) : (n = ["errExtract", e.name, "errPerm"], y.error(n), l.reject(n))
                    },
                    b = function (t, n) {
                        function i() {
                            n + 1 < c ? b(t, n + 1) : l.resolve()
                        }
                        var a = t[n],
                            e = y.splitFileExtention(a.name)[0],
                            o = 0 <= st.inArray(e, f);
                        !d && o && "directory" != m[e].mime ? y.confirm({
                            title: y.i18n("ntfextract"),
                            text: ["errExists", e, "confirmRepl"],
                            accept: {
                                label: "btnYes",
                                callback: function (e) {
                                    if (g(s = e ? "overwrite_all" : "overwrite"), p || u) {
                                        if (p) {
                                            for (r = n; r < c; r++) v(t[r]);
                                            l.resolve()
                                        }
                                    } else "overwrite" == s && v(a), n + 1 < c ? b(t, n + 1) : l.resolve()
                                }
                            },
                            reject: {
                                label: "btnNo",
                                callback: function (e) {
                                    g(s = e ? "omit_all" : "omit"), !p && !u && n + 1 < c ? b(t, n + 1) : u && l.resolve()
                                }
                            },
                            cancel: {
                                label: "btnCancel",
                                callback: function () {
                                    l.resolve()
                                }
                            },
                            all: n + 1 < c
                        }) : d ? (v(a), i()) : 0 == h ? y.confirm({
                            title: y.i18n("cmdextract"),
                            text: [y.i18n("cmdextract") + ' "' + a.name + '"', "confirmRepl"],
                            accept: {
                                label: "btnYes",
                                callback: function (e) {
                                    e && (h = 1), v(a), i()
                                }
                            },
                            reject: {
                                label: "btnNo",
                                callback: function (e) {
                                    e && (h = -1), i()
                                }
                            },
                            cancel: {
                                label: "btnCancel",
                                callback: function () {
                                    l.resolve()
                                }
                            },
                            all: n + 1 < c
                        }) : (0 < h && v(a), i())
                    };
                return this.enabled() && c && o.length ? (0 < c && b(e, 0), l) : l.reject()
            }
        }, (Fe.prototype.commands.forward = function () {
            this.alwaysEnabled = !0, this.updateOnSelect = !0, this.shortcuts = [{
                pattern: "ctrl+right"
            }], this.getstate = function () {
                return this.fm.history.canForward() ? 0 : -1
            }, this.exec = function () {
                return this.fm.history.forward()
            }
        }).prototype = {
            forceLoad: !0
        }, Fe.prototype.commands.fullscreen = function () {
            function e(e, t) {
                e.preventDefault(), e.stopPropagation(), t && t.fullscreen && (e = "on" === t.fullscreen, n.update(void 0, e), n.title = i.i18n(e ? "reinstate" : "cmdfullscreen"))
            }
            var n = this,
                i = this.fm;
            this.alwaysEnabled = !0, this.updateOnSelect = !1, this.syncTitleOnChange = !0, this.value = !1, this.options = {
                ui: "fullscreenbutton"
            }, this.getstate = function () {
                return 0
            }, this.exec = function () {
                var e = i.getUI().get(0),
                    e = e === i.toggleFullscreen(e);
                return n.title = i.i18n(e ? "reinstate" : "cmdfullscreen"), n.update(void 0, e), st.Deferred().resolve()
            }, i.bind("init", function () {
                i.getUI().off("resize." + i.namespace, e).on("resize." + i.namespace, e)
            })
        }, (Fe.prototype.commands.getfile = function () {
            var h = this,
                e = this.fm;
            this.alwaysEnabled = !0, this.callback = e.options.getFileCallback, this._disabled = "function" == typeof this.callback, this.getstate = function (e) {
                var t, n, e = this.files(e),
                    i = e.length;
                return this.callback && i && (e = e, t = h.options, n = !0, e = st.grep(e, function (e) {
                    return n = !(!n || "directory" == e.mime && !t.folders || !e.read)
                }), (t.multiple || 1 == e.length ? e : []).length == i) ? 0 : -1
            }, this.exec = function (e) {
                function t(e) {
                    return o.onlyURL ? o.multiple ? st.map(r, function (e) {
                        return e.url
                    }) : r[0].url : o.multiple ? r : r[0]
                }
                for (var n, i, a = this.fm, o = this.options, r = this.files(e), s = r.length, l = a.option("url"), c = a.option("tmbUrl"), d = st.Deferred().done(function (e) {
                    function t() {
                        "close" == o.oncomplete ? a.hide() : "destroy" == o.oncomplete && a.destroy()
                    }

                    function n(e) {
                        "close" == o.onerror ? a.hide() : "destroy" == o.onerror ? a.destroy() : e && a.error(e)
                    }
                    var i;
                    a.trigger("getfile", {
                        files: e
                    });
                    try {
                        i = h.callback(e, a)
                    } catch (e) {
                        return void n(["Error in `getFileCallback`.", e.message])
                    }
                    "object" == typeof i && "function" == typeof i.done ? i.done(t).fail(n) : t()
                }), p = [], u = 0; u < s; u++) {
                    if ("directory" == (n = r[u]).mime && !o.folders) return d.reject();
                    n.baseUrl = l, "1" == n.url ? p.push(a.request({
                        data: {
                            cmd: "url",
                            target: n.hash
                        },
                        notify: {
                            type: "url",
                            cnt: 1,
                            hideCnt: !0
                        },
                        preventDefault: !0
                    }).done(function (e) {
                        e.url && (a.file(this.hash).url = this.url = e.url)
                    }.bind(n))) : n.url = a.url(n.hash), o.onlyURL || (o.getPath && (n.path = a.path(n.hash), "" === n.path && n.phash && function () {
                        var e = st.Deferred();
                        p.push(e), a.path(n.hash, !1, {}).done(function (e) {
                            n.path = e
                        }).fail(function () {
                            n.path = ""
                        }).always(function () {
                            e.resolve()
                        })
                    }()), n.tmb && 1 != n.tmb && (n.tmb = c + n.tmb), n.width || n.height || (n.dim ? (i = n.dim.split("x"), n.width = i[0], n.height = i[1]) : o.getImgSize && -1 !== n.mime.indexOf("image") && p.push(a.request({
                        data: {
                            cmd: "dim",
                            target: n.hash
                        },
                        notify: {
                            type: "dim",
                            cnt: 1,
                            hideCnt: !0
                        },
                        preventDefault: !0
                    }).done(function (e) {
                        var t;
                        e.dim && (e = e.dim.split("x"), (t = a.file(this.hash)).width = this.width = e[0], t.height = this.height = e[1])
                    }.bind(n)))))
                }
                return p.length ? (st.when.apply(null, p).always(function () {
                    d.resolve(t())
                }), d) : d.resolve(t())
            }
        }).prototype = {
            forceLoad: !0
        }, (Fe.prototype.commands.help = function () {
            function r() {
                function i(n, e) {
                    return st.each(e, function (e, t) {
                        n.append(st("<dt></dt>").text(e)), void 0 === t ? n.append(st("<dd></dd>").append(st("<span></span>").text("undfined"))) : "object" != typeof t || t ? "object" == typeof t && (st.isPlainObject(t) || t.length) ? n.append(st("<dd></dd>").append(i(st("<dl></dl>"), t))) : n.append(st("<dd></dd>").append(st("<span></span>").text(t && "object" == typeof t ? "[]" : t || '""'))) : n.append(st("<dd></dd>").append(st("<span></span>").text("null")))
                    }), n
                }
                var t, n, a, e, o = u.children("li").length;
                (f.debug.options || f.debug.debug) && (5 <= o && (o = u.children("li:last"), (e = p.children("div:last")).is(":hidden") ? (o.remove(), e.remove()) : (o.prev().remove(), e.prev().remove())), o = h.namespace + "-help-debug-" + +new Date, t = st("<li></li>").html('<a href="' + O + "#" + o + '">' + f.debug.debug.cmd + "</a>").prependTo(u), n = st('<div id="' + o + '"></div>').data("debug", f.debug), t.on("click.debugrender", function () {
                    var e = n.data("debug");
                    n.removeData("debug"), e && (n.hide(), e.debug && (a = st("<fieldset>").append(st("<legend></legend>").text("debug"), i(st("<dl></dl>"), e.debug)), n.append(a)), e.options && (a = st("<fieldset>").append(st("<legend></legend>").text("options"), i(st("<dl></dl>"), e.options)), n.append(a)), n.show()), t.off("click.debugrender")
                }), u.after(n), s && p.tabs("refresh"))
            }
            var s, l, c, d, p, u, h = this.fm,
                f = this,
                m = '<div class="elfinder-help-link"> <a href="{url}" target="_blank">{link}</a></div>',
                g = '<div class="elfinder-help-team"><div>{author}</div>{work}</div>',
                v = /\{url\}/,
                b = /\{link\}/,
                y = /\{author\}/,
                w = /\{work\}/,
                x = "replace",
                k = "ui-priority-primary",
                C = "ui-priority-secondary",
                z = "elfinder-help-license",
                T = '<li class="' + h.res("class", "tabstab") + ' elfinder-help-tab-{id}"><a href="#' + h.namespace + '-help-{id}" class="ui-tabs-anchor">{title}</a></li>',
                A = ['<div class="ui-tabs ui-widget ui-widget-content ui-corner-all elfinder-help">', '<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-top">'],
                j = '<div class="elfinder-help-shortcut"><div class="elfinder-help-shortcut-pattern">{pattern}</div> {descrip}</div>',
                S = '<div class="elfinder-help-separator"></div>',
                O = st("base").length ? h.escape(document.location.href.replace(/#.*$/, "")) : "",
                I = h.res("class", "tabsactive"),
                M = function () {
                    var e = h.theme && h.theme.author ? g[x]("elfinder-help-team", "elfinder-help-team elfinder-help-term-theme")[x](y, h.i18n(h.theme.author) + (h.theme.email ? " &lt;" + h.theme.email + "&gt;" : ""))[x](w, h.i18n("theme") + " (" + h.i18n(h.theme.name) + ")") : '<div class="elfinder-help-team elfinder-help-term-theme" style="display:none"></div>';
                    return e
                },
                E = !1,
                D = !1,
                F = "";
            this.alwaysEnabled = !0, this.updateOnSelect = !1, this.state = -1, this.shortcuts = [{
                pattern: "f1",
                description: this.title
            }], h.bind("load", function () {
                var e, t, n, i, a, o = f.options.view || ["about", "shortcuts", "help", "integrations", "debug"]; - 1 !== (a = st.inArray("preference", o)) && o.splice(a, 1), st.fn.tabs || -1 !== (a = st.inArray(o, "debug")) && o.splice(a, 1), st.each(o, function (e, t) {
                    A.push(T[x](/\{id\}/g, t)[x](/\{title\}/, h.i18n(t)))
                }), A.push("</ul>"), -1 !== st.inArray("about", o) && (A.push('<div id="' + h.namespace + '-help-about" class="ui-tabs-panel ui-widget-content ui-corner-bottom"><div class="elfinder-help-logo"></div>'), A.push("<h3>elFinder</h3>"), A.push('<div class="' + k + '">' + h.i18n("webfm") + "</div>"), A.push('<div class="' + C + '">' + h.i18n("ver") + ": " + h.version + "</div>"), A.push('<div class="' + C + '">' + h.i18n("protocolver") + ': <span class="apiver"></span></div>'), A.push('<div class="' + C + '">jQuery/jQuery UI: ' + st().jquery + "/" + st.ui.version + "</div>"), A.push(S), A.push(m[x](v, "https://studio-42.github.io/elFinder/")[x](b, h.i18n("homepage"))), A.push(m[x](v, "https://github.com/Studio-42/elFinder/wiki")[x](b, h.i18n("docs"))), A.push(m[x](v, "https://github.com/Studio-42/elFinder")[x](b, h.i18n("github"))), A.push(S), A.push('<div class="' + k + '">' + h.i18n("team") + "</div>"), A.push(g[x](y, 'Dmitry "dio" Levashov &lt;dio@std42.ru&gt;')[x](w, h.i18n("chiefdev"))), A.push(g[x](y, "Naoki Sawada (nao-pon)&lt;hypweb+elfinder@gmail.com&gt;")[x](w, h.i18n("developer"))), A.push(g[x](y, "Troex Nevelin &lt;troex@fury.scancode.ru&gt;")[x](w, h.i18n("maintainer"))), A.push(g[x](y, "Alexey Sukhotin &lt;strogg@yandex.ru&gt;")[x](w, h.i18n("contributor"))), h.i18[h.lang].translator && st.each(h.i18[h.lang].translator.split(", "), function () {
                    A.push(g[x](y, st.trim(this))[x](w, h.i18n("translator") + " (" + h.i18[h.lang].language + ")"))
                }), A.push(M()), A.push(S), A.push('<div class="' + z + '">' + h.i18n("icons") + ': Pixelmixer, <a href="http://p.yusukekamiyamane.com" target="_blank">Fugue</a>, <a href="https://icons8.com" target="_blank">Icons8</a></div>'), A.push(S), A.push('<div class="' + z + '">Licence: 3-clauses BSD Licence</div>'), A.push('<div class="' + z + '">Copyright © 2009-2024, Studio 42 / nao-pon</div>'), A.push('<div class="' + z + '">„ …' + h.i18n("dontforget") + " ”</div>"), A.push("</div>")), -1 !== st.inArray("shortcuts", o) && (a = h.shortcuts(), A.push('<div id="' + h.namespace + '-help-shortcuts" class="ui-tabs-panel ui-widget-content ui-corner-bottom">'), a.length ? (A.push('<div class="ui-widget-content elfinder-help-shortcuts">'), st.each(a, function (e, t) {
                    A.push(j.replace(/\{pattern\}/, t[0]).replace(/\{descrip\}/, t[1]))
                }), A.push("</div>")) : A.push('<div class="elfinder-help-disabled">' + h.i18n("shortcutsof") + "</div>"), A.push("</div>")), -1 !== st.inArray("help", o) && (e = h.i18nBaseUrl + "help/%s.html.js", A.push('<div id="' + h.namespace + '-help-help" class="ui-tabs-panel ui-widget-content ui-corner-bottom">'), A.push('<a href="https://github.com/Studio-42/elFinder/wiki" target="_blank" class="elfinder-dont-panic"><span>DON\'T PANIC</span></a>'), A.push("</div>")), -1 !== st.inArray("integrations", o) && (E = !0, A.push('<div id="' + h.namespace + '-help-integrations" class="ui-tabs-panel ui-widget-content ui-corner-bottom"></div>')), -1 !== st.inArray("debug", o) && (D = !0, A.push('<div id="' + h.namespace + '-help-debug" class="ui-tabs-panel ui-widget-content ui-corner-bottom">'), A.push('<div class="ui-widget-content elfinder-help-debug"><ul></ul></div>'), A.push("</div>")), A.push("</div>"), (F = st(A.join(""))).find(".ui-tabs-nav li").on("mouseenter mouseleave", function (e) {
                    st(this).toggleClass("ui-state-hover", "mouseenter" === e.type)
                }).on("focus blur", "a", function (e) {
                    st(e.delegateTarget).toggleClass("ui-state-focus", "focusin" === e.type)
                }).children().on("click", function (e) {
                    var t = st(this);
                    e.preventDefault(), e.stopPropagation(), t.parent().addClass(I).siblings().removeClass(I), F.children(".ui-tabs-panel").hide().filter(t.attr("href")).show()
                }).filter(":first").trigger("click"), E && (l = F.find(".elfinder-help-tab-integrations").hide(), c = F.find("#" + h.namespace + "-help-integrations").hide().append(st('<div class="elfinder-help-integrations-desc"></div>').html(h.i18n("integrationWith"))), h.bind("helpIntegration", function (e) {
                    var t, n, i, a = c.children("ul:first");
                    e.data && (st.isPlainObject(e.data) ? ((t = Object.assign({
                        link: "",
                        title: "",
                        banner: ""
                    }, e.data)).title || t.link) && (t.title || (t.title = t.link), n = (t.link ? st("<a></a>").attr("href", t.link).attr("target", "_blank") : st("<span></span>")).text(t.title), t.banner && (n = st("<span></span>").append(st("<img/>").attr(t.banner), n))) : (n = st(e.data)).filter("a").each(function () {
                        var e = st(this);
                        e.attr("target") || e.attr("target", "_blank")
                    }), n && (l.show(), a.length || (a = st('<ul class="elfinder-help-integrations"></ul>').appendTo(c)), t && t.cmd ? (e = "elfinder-help-integration-" + t.cmd, (i = a.find("ul." + e)).length || (i = st('<ul class="' + e + '"></ul>'), a.append(st("<li></li>").append(st("<span></span>").html(h.i18n("cmd" + t.cmd))).append(i))), i.append(st("<li></li>").append(n))) : a.append(st("<li></li>").append(n))))
                }).bind("themechange", function () {
                    F.find("div.elfinder-help-term-theme").replaceWith(M())
                })), D && (d = F.find(".elfinder-help-tab-debug").hide(), p = F.find("#" + h.namespace + "-help-debug").children("div:first"), u = p.children("ul:first").on("click", function (e) {
                    e.preventDefault(), e.stopPropagation()
                }), f.debug = {}, h.bind("backenddebug", function (e) {
                    D && e.data && e.data.debug && (f.debug = {
                        options: e.data.options,
                        debug: Object.assign({
                            cmd: h.currentReqCmd
                        }, e.data.debug)
                    }, f.dialog && r())
                })), F.find("#" + h.namespace + "-help-about").find(".apiver").text(h.api), f.dialog = f.fmDialog(F, {
                    title: f.title,
                    width: 530,
                    maxWidth: "window",
                    maxHeight: "window",
                    autoOpen: !1,
                    destroyOnClose: !1,
                    close: function () {
                        D && (d.hide(), p.tabs("destroy")), s = !1
                    }
                }).on("click", function (e) {
                    e.stopPropagation()
                }).css({
                    overflow: "hidden"
                }), a = f.dialog.children(".ui-tabs"), t = a.children(".ui-tabs-nav:first"), n = a.children(".ui-tabs-panel"), i = f.dialog.outerHeight(!0) - f.dialog.height(), f.dialog.closest(".ui-dialog").on("resize", function () {
                    n.height(f.dialog.height() - i - t.outerHeight(!0) - 20)
                }), e && f.dialog.one("initContents", function () {
                    st.ajax({
                        url: f.options.helpSource || e.replace("%s", h.lang),
                        dataType: "html"
                    }).done(function (e) {
                        st("#" + h.namespace + "-help-help").html(e)
                    }).fail(function () {
                        st.ajax({
                            url: e.replace("%s", "en"),
                            dataType: "html"
                        }).done(function (e) {
                            st("#" + h.namespace + "-help-help").html(e)
                        })
                    })
                }), f.state = 0, h.trigger("helpBuilded", f.dialog)
            }).one("open", function () {
                var e = !1;
                h.one("backenddebug", function () {
                    e = !0
                }).one("opendone", function () {
                    requestAnimationFrame(function () {
                        !e && D && (D = !1, d.hide(), p.hide(), u.hide())
                    })
                })
            }), this.getstate = function () {
                return 0
            }, this.exec = function (e, t) {
                t = t ? t.tab : void 0;
                return D && (p.tabs(), u.find("a:first").trigger("click"), d.show(), s = !0), this.dialog.trigger("initContents").elfinderdialog("open").find((t ? ".elfinder-help-tab-" + t : ".ui-tabs-nav li") + " a:first").trigger("click"), st.Deferred().resolve()
            }
        }).prototype = {
            forceLoad: !0
        }, Fe.prototype.commands.hidden = function () {
            this.hidden = !0, this.updateOnSelect = !1, this.getstate = function () {
                return -1
            }
        }, Fe.prototype.commands.hide = function () {
            var c, d, i, p, u = this,
                h = {};
            this.syncTitleOnChange = !0, this.shortcuts = [{
                pattern: "ctrl+shift+dot",
                description: this.fm.i18n("toggleHidden")
            }], this.init = function () {
                var e = this.fm;
                c = e.storage("hide") || {
                    items: {}
                }, d = Object.keys(c.items).length, this.title = e.i18n(c.show ? "hideHidden" : "showHidden"), u.update(void 0, u.title)
            }, this.fm.bind("select contextmenucreate closecontextmenu", function (e, t) {
                var n = (e.data ? e.data.selected || e.data.targets : null) || t.selected();
                "select" === e.type && e.data ? p = e.data.origin : "contextmenucreate" === e.type && (i = e.data.type), !n.length || ("contextmenucreate" !== e.type && "navbar" !== p || "cwd" === i) && n[0] === t.cwd().hash ? u.title = t.i18n(c.show ? "hideHidden" : "showHidden") : u.title = t.i18n("cmdhide"), "closecontextmenu" !== e.type ? u.update("cwd" === i ? d ? 0 : -1 : void 0, u.title) : (i = "", requestAnimationFrame(function () {
                    u.update(void 0, u.title)
                }))
            }), this.getstate = function (e) {
                return this.fm.cookieEnabled && "cwd" !== i && (e || this.fm.selected()).length || d ? 0 : -1
            }, this.exec = function (e, t) {
                var i, n, a = this.fm,
                    o = st.Deferred().done(function () {
                        a.trigger("hide", {
                            items: s,
                            opts: t
                        })
                    }).fail(function (e) {
                        a.error(e)
                    }),
                    r = t || {},
                    s = r.targets || e || a.selected(),
                    l = [];
                if (c = a.storage("hide") || {}, st.isPlainObject(c) || (c = {}), st.isPlainObject(c.items) || (c.items = {}), "shortcut" !== t._currentType && s.length && ("navbar" === t._currentType || "navbar" === p || s[0] !== a.cwd().hash) || (c.show ? r.hide = !0 : Object.keys(c.items).length && (r.show = !0)), r.reset && (r.show = !0, d = 0), r.show || r.hide) {
                    if (r.show ? c.show = !0 : delete c.show, r.show) return a.storage("hide", r.reset ? null : c), u.title = a.i18n("hideHidden"), u.update(r.reset ? -1 : void 0, u.title), st.each(c.items, function (e) {
                        e = a.file(e, !0);
                        e && (a.searchStatus.state || !e.phash || a.file(e.phash)) && l.push(e)
                    }), l.length && (a.updateCache({
                        added: l
                    }), a.add({
                        added: l
                    })), r.reset && (c = {
                        items: {}
                    }), o.resolve();
                    s = Object.keys(c.items)
                }
                return s.length && (st.each(s, function (e, t) {
                    var n;
                    c.items[t] || ((n = a.file(t)) && (h[t] = n.i18 || n.name), c.items[t] = h[t] || t)
                }), d = Object.keys(c.items).length, i = this.files(s), a.storage("hide", c), a.remove({
                    removed: s
                }), c.show && this.exec(void 0, {
                    hide: !0
                }), r.hide || (n = {
                    undo: {
                        cmd: "hide",
                        callback: function () {
                            var n = a.storage("hide");
                            n && (st.each(s, function (e, t) {
                                delete n.items[t]
                            }), d = Object.keys(n.items).length, a.storage("hide", n), a.trigger("hide", {
                                items: s,
                                opts: {}
                            }), u.update(d ? 0 : -1)), a.updateCache({
                                added: i
                            }), a.add({
                                added: i
                            })
                        }
                    },
                    redo: {
                        cmd: "hide",
                        callback: function () {
                            return a.exec("hide", void 0, {
                                targets: s
                            })
                        }
                    }
                })), "rejected" == o.state() ? o : o.resolve(n)
            }
        }, (Fe.prototype.commands.home = function () {
            this.title = "Home", this.alwaysEnabled = !0, this.updateOnSelect = !1, this.shortcuts = [{
                pattern: "ctrl+home ctrl+shift+up",
                description: "Home"
            }], this.getstate = function () {
                var e = this.fm.root(),
                    t = this.fm.cwd().hash;
                return e && t && e != t ? 0 : -1
            }, this.exec = function () {
                return this.fm.exec("open", this.fm.root())
            }
        }).prototype = {
            forceLoad: !0
        }, (Fe.prototype.commands.info = function () {
            function I(e, t) {
                return t ? e.replace(/\u200B/g, "") : e.replace(/(\/|\\)/g, "$1​")
            }
            var n = this.fm,
                M = "elfinder-spinner",
                E = {
                    calc: n.i18n("calc"),
                    size: n.i18n("size"),
                    unknown: n.i18n("unknown"),
                    path: n.i18n("path"),
                    aliasfor: n.i18n("aliasfor"),
                    modify: n.i18n("modify"),
                    perms: n.i18n("perms"),
                    locked: n.i18n("locked"),
                    dim: n.i18n("dim"),
                    kind: n.i18n("kind"),
                    files: n.i18n("files"),
                    folders: n.i18n("folders"),
                    roots: n.i18n("volumeRoots"),
                    items: n.i18n("items"),
                    yes: n.i18n("yes"),
                    no: n.i18n("no"),
                    link: n.i18n("link"),
                    owner: n.i18n("owner"),
                    group: n.i18n("group"),
                    perm: n.i18n("perm"),
                    getlink: n.i18n("getLink")
                };
            this.items = ["size", "aliasfor", "path", "link", "dim", "modify", "perms", "locked", "owner", "group", "perm"], this.options.custom && Object.keys(this.options.custom).length && st.each(this.options.custom, function (e, t) {
                t.label && this.items.push(t.label)
            }), this.tpl = {
                main: '<div class="ui-helper-clearfix elfinder-info-title {dirclass}"><span class="elfinder-cwd-icon {class} ui-corner-all"{style}></span>{title}</div><table class="elfinder-info-tb">{content}</table>',
                itemTitle: '<strong>{name}</strong><span class="elfinder-info-kind">{kind}</span>',
                groupTitle: "<strong>{items}: {num}</strong>",
                row: '<tr><td class="elfinder-info-label">{label} : </td><td class="{class}">{value}</td></tr>',
                spinner: '<span>{text}</span> <span class="' + M + " " + M + '-{name}"></span>'
            }, this.alwaysEnabled = !0, this.updateOnSelect = !1, this.shortcuts = [{
                pattern: "ctrl+i"
            }], this.init = function () {
                st.each(E, function (e, t) {
                    E[e] = n.i18n(t)
                })
            }, this.getstate = function () {
                return 0
            }, this.exec = function (e) {
                function i(e, t, n) {
                    z.find("." + M + "-" + t).parent().html(e).addClass(n || "")
                }
                var n, t, a, o, r, s, l, c, e = this.files(e),
                    d = (e.length || (e = this.files([this.fm.cwd().hash])), this.fm),
                    p = this.options,
                    u = this.tpl,
                    h = u.row,
                    f = e.length,
                    m = [],
                    g = u.main,
                    v = "{label}",
                    b = "{value}",
                    y = [],
                    w = null,
                    x = {
                        title: d.i18n("selectionInfo"),
                        width: "auto",
                        close: function () {
                            st(this).elfinderdialog("destroy"), w && "pending" === w.state() && w.reject(), st.grep(y, function (e) {
                                e && "pending" === e.state() && e.reject()
                            })
                        }
                    },
                    k = [],
                    C = d.namespace + "-info-" + st.map(e, function (e) {
                        return e.hash
                    }).join("-"),
                    z = d.getUI().find("#" + C),
                    T = [],
                    A = "",
                    j = "elfinder-font-mono elfinder-info-hash",
                    S = [],
                    O = d.ui.notify;
                return O.is(":hidden") && O.children(".elfinder-notify").length && O.elfinderdialog("open").height("auto"), f ? (z.length ? z.elfinderdialog("toTop") : (o = d.storage("infohides") || d.arrayFlip(p.hideItems, !0), 1 === f ? ((c = e[0]).icon && (A = " " + d.getIconStyle(c)), g = g.replace("{dirclass}", c.csscls ? d.escape(c.csscls) : "").replace("{class}", d.mime2class(c.mime)).replace("{style}", A), a = u.itemTitle.replace("{name}", d.escape(c.i18 || c.name)).replace("{kind}", '<span title="' + d.escape(c.mime) + '">' + d.mime2kind(c) + "</span>"), t = d.tmb(c), c.read ? "directory" != c.mime || c.alias ? n = d.formatSize(c.size) : (n = u.spinner.replace("{text}", E.calc).replace("{name}", "size"), k.push(c.hash)) : n = E.unknown, o.size || m.push(h.replace(v, E.size).replace(b, n)), !o.aleasfor && c.alias && m.push(h.replace(v, E.aliasfor).replace(b, c.alias)), o.path || ((O = d.path(c.hash, !0)) ? m.push(h.replace(v, E.path).replace(b, I(d.escape(O))).replace("{class}", "elfinder-info-path")) : (m.push(h.replace(v, E.path).replace(b, u.spinner.replace("{text}", E.calc).replace("{name}", "path")).replace("{class}", "elfinder-info-path")), y.push(d.path(c.hash, !0, {
                    notify: null
                }).fail(function () {
                    i(E.unknown, "path")
                }).done(function (e) {
                    i(I(e), "path")
                })))), !o.link && c.read && (s = d.escape(c.name), "1" == c.url ? m.push(h.replace(v, E.link).replace(b, '<button class="elfinder-info-button ' + M + '-url">' + E.getlink + "</button>")) : (c.url ? l = c.url : "directory" === c.mime ? p.nullUrlDirLinkSelf && null === c.url ? l = (A = window.location).pathname + A.search + "#elf_" + c.hash : "" !== c.url && d.option("url", !d.isRoot(c) && c.phash || c.hash) && (l = d.url(c.hash)) : l = d.url(c.hash), l && m.push(h.replace(v, E.link).replace(b, '<a href="' + l + '" target="_blank">' + s + "</a>")))), o.dim || (c.dim ? m.push(h.replace(v, E.dim).replace(b, c.dim)) : -1 !== c.mime.indexOf("image") && (c.width && c.height ? m.push(h.replace(v, E.dim).replace(b, c.width + "x" + c.height)) : c.size && "0" !== c.size && (m.push(h.replace(v, E.dim).replace(b, u.spinner.replace("{text}", E.calc).replace("{name}", "dim"))), y.push(d.request({
                    data: {
                        cmd: "dim",
                        target: c.hash
                    },
                    preventDefault: !0
                }).fail(function () {
                    i(E.unknown, "dim")
                }).done(function (e) {
                    var t;
                    i(e.dim || E.unknown, "dim"), e.dim && (e = e.dim.split("x"), (t = d.file(c.hash)).width = e[0], t.height = e[1])
                }))))), o.modify || m.push(h.replace(v, E.modify).replace(b, d.formatDate(c))), o.perms || m.push(h.replace(v, E.perms).replace(b, d.formatPermissions(c))), o.locked || m.push(h.replace(v, E.locked).replace(b, c.locked ? E.yes : E.no)), !o.owner && c.owner && m.push(h.replace(v, E.owner).replace(b, c.owner)), !o.group && c.group && m.push(h.replace(v, E.group).replace(b, c.group)), !o.perm && c.perm && m.push(h.replace(v, E.perm).replace(b, d.formatFileMode(c.perm))), window.ArrayBuffer && (d.options.cdns.sparkmd5 || d.options.cdns.jssha) && "directory" !== c.mime && 0 < c.size && (!p.showHashMaxsize || c.size <= p.showHashMaxsize) && (S = [], st.each(d.storage("hashchekcer") || p.showHashAlgorisms, function (e, t) {
                    c[t] ? m.push(h.replace(v, d.i18n(t)).replace(b, c[t]).replace("{class}", j)) : (m.push(h.replace(v, d.i18n(t)).replace(b, u.spinner.replace("{text}", E.calc).replace("{name}", t))), S.push(t))
                }), S.length && (r = st('<div class="elfinder-quicklook-info-progress"></div>'), y.push(d.getContentsHashes(c.hash, S, p.showHashOpts, {
                    progressBar: r
                }).progress(function (n) {
                    st.each(S, function (e, t) {
                        n[t] && i(n[t], t, j)
                    })
                }).always(function () {
                    st.each(S, function (e, t) {
                        i(E.unknown, t)
                    })
                })))), p.custom && st.each(p.custom, function (e, t) {
                    o[t.label] || t.mimes && !st.grep(t.mimes, function (e) {
                        return c.mime === e || 0 === c.mime.indexOf(e + "/")
                    }).length || t.hashRegex && !c.hash.match(t.hashRegex) || (m.push(h.replace(v, d.i18n(t.label)).replace(b, t.tpl.replace("{id}", C))), t.action && "function" == typeof t.action && T.push(t.action))
                })) : (g = g.replace("{class}", "elfinder-cwd-icon-group"), a = u.groupTitle.replace("{items}", E.items).replace("{num}", f), (O = st.grep(e, function (e) {
                    return "directory" == e.mime
                }).length) ? (O -= A = st.grep(e, function (e) {
                    return !("directory" !== e.mime || e.phash && !e.isroot)
                }).length, m.push(h.replace(v, E.kind).replace(b, A === f || O === f ? E[A ? "roots" : "folders"] : st.map({
                    roots: A,
                    folders: O,
                    files: f - A - O
                }, function (e, t) {
                    return e ? E[t] + " " + e : null
                }).join(", "))), o.size || m.push(h.replace(v, E.size).replace(b, u.spinner.replace("{text}", E.calc).replace("{name}", "size"))), k = st.map(e, function (e) {
                    return e.hash
                })) : (n = 0, st.each(e, function (e, t) {
                    t = parseInt(t.size);
                    0 <= t && 0 <= n ? n += t : n = "unknown"
                }), m.push(h.replace(v, E.kind).replace(b, E.files)), o.size || m.push(h.replace(v, E.size).replace(b, d.formatSize(n))))), g = g.replace("{title}", a).replace("{content}", m.join("").replace(/{class}/g, "")), (z = this.fmDialog(g, x)).attr("id", C).one("mousedown", ".elfinder-info-path", function () {
                    st(this).html(I(st(this).html(), !0))
                }), S.length && r.appendTo(z.find("." + M + "-" + S[0]).parent()), d.UA.Mobile && st.fn.tooltip && z.children(".ui-dialog-content .elfinder-info-title").tooltip({
                    classes: {
                        "ui-tooltip": "elfinder-ui-tooltip ui-widget-shadow"
                    },
                    tooltipClass: "elfinder-ui-tooltip ui-widget-shadow",
                    track: !0
                }), c && "1" == c.url && z.on("click", "." + M + "-url", function () {
                    st(this).parent().html(u.spinner.replace("{text}", d.i18n("ntfurl")).replace("{name}", "url")), d.request({
                        data: {
                            cmd: "url",
                            target: c.hash
                        },
                        preventDefault: !0
                    }).fail(function () {
                        i(s, "url")
                    }).done(function (e) {
                        e.url ? (i('<a href="' + e.url + '" target="_blank">' + s + "</a>" || s, "url"), d.file(c.hash).url = e.url) : i(s, "url")
                    })
                }), t && st("<img/>").on("load", function () {
                    z.find(".elfinder-cwd-icon").addClass(t.className).css("background-image", "url('" + t.url + "')")
                }).attr("src", t.url), k.length && (w = d.getSize(k).done(function (e) {
                    i(e.formated, "size")
                }).fail(function () {
                    i(E.unknown, "size")
                })), T.length && st.each(T, function (e, t) {
                    try {
                        t(c, d, z)
                    } catch (e) {
                        d.debug("error", e)
                    }
                })), st.Deferred().resolve()) : st.Deferred().reject()
            }
        }).prototype = {
            forceLoad: !0
        }, Fe.prototype.commands.mkdir = function () {
            var a, o = this.fm,
                n = this;
            this.value = "", this.disableOnSearch = !0, this.updateOnSelect = !1, this.syncTitleOnChange = !0, this.mime = "directory", this.prefix = "untitled folder", this.exec = function (e, t) {
                return e && e.length && t && t._currentType && "navbar" === t._currentType ? (this.origin = t._currentType, this.data = {
                    target: e[0]
                }) : (t = o.cwd().hash === e[0], this.origin = a && !t ? a : "cwd", delete this.data), e || this.options.intoNewFolderToolbtn || o.getUI("cwd").trigger("unselectall"), this.move = this.value === o.i18n("cmdmkdirin"), st.proxy(o.res("mixin", "make"), n)()
            }, this.shortcuts = [{
                pattern: "ctrl+shift+n"
            }], this.init = function () {
                this.options.intoNewFolderToolbtn && (this.syncTitleOnChange = !0)
            }, o.bind("select contextmenucreate closecontextmenu", function (e) {
                var t = (e.data ? e.data.selected || e.data.targets : null) || o.selected();
                n.className = "mkdir", a = e.data && t.length && (e.data.origin || e.data.type) || "", n.options.intoNewFolderToolbtn || "" !== a || (a = "cwd"), t.length && "navbar" !== a && "cwd" !== a && o.cwd().hash !== t[0] ? (n.title = o.i18n("cmdmkdirin"), n.className += " elfinder-button-icon-mkdirin") : n.title = o.i18n("cmdmkdir"), "closecontextmenu" !== e.type ? n.update(void 0, n.title) : requestAnimationFrame(function () {
                    n.update(void 0, n.title)
                })
            }), this.getstate = function (e) {
                var t, n = o.cwd(),
                    e = "navbar" === a || e && e[0] !== n.hash ? this.files(e || o.selected()) : [],
                    i = e.length;
                return "navbar" === a ? i && e[0].write && e[0].read ? 0 : -1 : !n.write || i && (t = !0, st.grep(e, function (e) {
                    return t = !(!t || !e.read || e.locked)
                }).length != i) ? -1 : 0
            }
        }, Fe.prototype.commands.mkfile = function () {
            var o = this;
            this.disableOnSearch = !0, this.updateOnSelect = !1, this.mime = "text/plain", this.prefix = "untitled file.txt", this.variants = [], this.getTypeName = function (e, t) {
                var n = o.fm,
                    e = (e = n.messages["kind" + n.kinds[e]]) ? n.i18n(["extentiontype", t.toUpperCase(), e]) : n.i18n(["extentionfile", t.toUpperCase()]);
                return e
            }, this.fm.bind("open reload canMakeEmptyFile", function () {
                var n = o.fm,
                    i = n.getCommand("edit").getMkfileHides();
                o.variants = [], n.mimesCanMakeEmpty && st.each(n.mimesCanMakeEmpty, function (e, t) {
                    t && !i[e] && n.uploadMimeCheck(e) && o.variants.push([e, o.getTypeName(e, t)])
                }), o.change()
            }), this.getstate = function () {
                return this.fm.cwd().write ? 0 : -1
            }, this.exec = function (e, t) {
                var n, i, a = o.fm;
                if (n = a.mimesCanMakeEmpty[t]) {
                    if (a.uploadMimeCheck(t)) return this.mime = t, this.prefix = a.i18n(["untitled file", n]), st.proxy(a.res("mixin", "make"), o)();
                    i = ["errMkfile", o.getTypeName(t, n)]
                }
                return st.Deferred().reject(i)
            }
        }, Fe.prototype.commands.netmount = function () {
            var p, u = this,
                n = !1;
            this.alwaysEnabled = !0, this.updateOnSelect = !1, this.drivers = [], this.handlers = {
                load: function () {
                    var t = u.fm;
                    t.cookieEnabled && t.one("open", function () {
                        u.drivers = t.netDrivers, u.drivers.length && st.each(u.drivers, function () {
                            var e = u.options[this];
                            e && (n = !0, e.integrateInfo && t.trigger("helpIntegration", Object.assign({
                                cmd: "netmount"
                            }, e.integrateInfo)))
                        })
                    })
                }
            }, this.getstate = function () {
                return n ? 0 : -1
            }, this.exec = function () {
                function e() {
                    function e() {
                        o.protocol.trigger("change", "winfocus")
                    }

                    function i() {
                        var n, e = o.protocol.val(),
                            a = {
                                cmd: "netmount",
                                protocol: e
                            },
                            t = d[e];
                        if (st.each(p.find("input.elfinder-netmount-inputs-" + e), function (e, t) {
                            var n, i = st(t);
                            (n = !i.is(":radio,:checkbox") || i.is(":checked") ? st.trim(i.val()) : n) && (a[t.name] = n)
                        }), !a.host) return l.trigger("error", {
                            error: "errNetMountHostReq",
                            opts: {
                                modal: !0
                            }
                        });
                        a.mnt2res && (n = !0), l.request({
                            data: a,
                            notify: {
                                type: "netmount",
                                cnt: 1,
                                hideCnt: !0
                            }
                        }).done(function (e) {
                            var t;
                            e.added && e.added.length && (n && o.protocol.trigger("change", "reset"), e.added[0].phash && (t = l.file(e.added[0].phash)) && !t.dirs && (t.dirs = 1, l.change({
                                changed: [t]
                            })), l.one("netmountdone", function () {
                                l.exec("open", e.added[0].hash)
                            })), c.resolve()
                        }).fail(function (e) {
                            t.fail && "function" == typeof t.fail && t.fail(l, l.parseError(e)), c.reject(e)
                        }), u.dialog.elfinderdialog("close")
                    }
                    var t, o = {
                        protocol: st("<select></select>").on("change", function (e, t) {
                            var n = this.value;
                            p.find(".elfinder-netmount-tr").hide(), p.find(".elfinder-netmount-tr-" + n).show(), s && s.children(".ui-dialog-buttonpane:first").find("button").show(), "function" == typeof d[n].select && d[n].select(l, e, t)
                        }).addClass("ui-corner-all")
                    },
                        n = {
                            title: l.i18n("netMountDialogTitle"),
                            resizable: !0,
                            modal: !0,
                            destroyOnClose: !1,
                            open: function () {
                                st(window).on("focus." + l.namespace, e), o.protocol.trigger("change")
                            },
                            close: function () {
                                "pending" == c.state() && c.reject(), st(window).off("focus." + l.namespace, e)
                            },
                            buttons: {}
                        },
                        a = st('<form autocomplete="off"></form>').on("keydown", "input", function (e) {
                            var t, n = !0;
                            e.keyCode === st.ui.keyCode.ENTER && (st.each(a.find("input:visible:not(.elfinder-input-optional)"), function () {
                                if ("" === st(this).val()) return n = !1, t = st(this), !1
                            }), n ? i() : t.trigger("focus"))
                        }),
                        r = st("<div></div>");
                    return p = st('<table class="elfinder-info-tb elfinder-netmount-tb"></table>').append(st("<tr></tr>").append(st("<td>" + l.i18n("protocol") + "</td>")).append(st("<td></td>").append(o.protocol))), st.each(u.drivers, function (e, n) {
                        d[n] && (o.protocol.append('<option value="' + n + '">' + l.i18n(d[n].name || n) + "</option>"), st.each(d[n].inputs, function (e, t) {
                            t.attr("name", e), "hidden" != t.attr("type") ? (t.addClass("ui-corner-all elfinder-netmount-inputs-" + n), p.append(st("<tr></tr>").addClass("elfinder-netmount-tr elfinder-netmount-tr-" + n).append(st("<td>" + l.i18n(e) + "</td>")).append(st("<td></td>").append(t)))) : (t.addClass("elfinder-netmount-inputs-" + n), r.append(t))
                        }), d[n].protocol = o.protocol)
                    }), p.append(r), p.find(".elfinder-netmount-tr").hide(), p.find(".elfinder-netmount-tr-" + u.drivers[0]).show(), n.buttons[l.i18n("btnMount")] = i, n.buttons[l.i18n("btnCancel")] = function () {
                        u.dialog.elfinderdialog("close")
                    }, p.find("select,input").addClass("elfinder-tabstop"), t = u.fmDialog(a.append(p), n).ready(function () {
                        o.protocol.trigger("change"), t.elfinderdialog("posInit")
                    }), s = t.closest(".ui-dialog"), t
                }
                var s, l = u.fm,
                    c = st.Deferred(),
                    d = u.options;
                return u.dialog ? u.dialog.elfinderdialog("open") : u.dialog = e(), c.promise()
            }, u.fm.bind("netmount", function (e) {
                function t() {
                    i[n.protocol] && "function" == typeof i[n.protocol].done && (i[n.protocol].done(u.fm, n), p.find("select,input").addClass("elfinder-tabstop"), u.dialog.elfinderdialog("tabstopsInit"))
                }
                var n = e.data || null,
                    i = u.options;
                n && n.protocol && (n.mode && "redirect" === n.mode ? u.fm.request({
                    data: {
                        cmd: "netmount",
                        protocol: n.protocol,
                        host: n.host,
                        user: "init",
                        pass: "return",
                        options: n.options
                    },
                    preventDefault: !0
                }).done(function (e) {
                    n = JSON.parse(e.body), t()
                }) : t())
            })
        }, Fe.prototype.commands.netunmount = function () {
            this.alwaysEnabled = !0, this.updateOnSelect = !1, this.drivers = [], this.handlers = {
                load: function () {
                    this.drivers = this.fm.netDrivers
                }
            }, this.getstate = function (e) {
                var t = this.fm;
                return e && this.drivers.length && !this._disabled && (t = t.file(e[0])) && t.netkey ? 0 : -1
            }, this.exec = function (e) {
                var c = this,
                    d = this.fm,
                    p = st.Deferred().fail(function (e) {
                        e && d.error(e)
                    }),
                    u = d.file(e[0]);
                return this._disabled ? p.reject() : ("pending" == p.state() && d.confirm({
                    title: c.title,
                    text: d.i18n("confirmUnmount", u.name),
                    accept: {
                        label: "btnUnmount",
                        callback: function () {
                            function e() {
                                st.when(s).done(function () {
                                    d.request({
                                        data: {
                                            cmd: "netmount",
                                            protocol: "netunmount",
                                            host: u.netkey,
                                            user: t,
                                            pass: "dum"
                                        },
                                        notify: {
                                            type: "netunmount",
                                            cnt: 1,
                                            hideCnt: !0
                                        },
                                        preventFail: !0
                                    }).fail(function (e) {
                                        p.reject(e)
                                    }).done(function (e) {
                                        u.volumeid && delete d.volumeExpires[u.volumeid], p.resolve()
                                    })
                                }).fail(function (e) {
                                    l.length && d.remove({
                                        removed: l
                                    }), p.reject(e)
                                })
                            }
                            var i, a, n, o, t = u.hash,
                                r = (i = t, n = [], d.leafRoots && (a = [], st.each(d.leafRoots, function (e, t) {
                                    var n, e = d.parents(e); - 1 !== (n = st.inArray(i, e)) && (n = e.length - n, st.each(t, function (e, t) {
                                        a.push({
                                            i: n,
                                            hash: t
                                        })
                                    }))
                                }), a.length && (a.sort(function (e, t) {
                                    return e.i < t.i
                                }), st.each(a, function (e, t) {
                                    n.push(t.hash)
                                }))), n),
                                s = [],
                                l = [];
                            r.length ? d.confirm({
                                title: c.title,
                                text: (o = ["unmountChildren"], st.each(r, function (e, t) {
                                    o.push([d.file(t).name])
                                }), o),
                                accept: {
                                    label: "btnUnmount",
                                    callback: function () {
                                        st.each(r, function (e, t) {
                                            var n = d.file(t);
                                            n.netkey && s.push(d.request({
                                                data: {
                                                    cmd: "netmount",
                                                    protocol: "netunmount",
                                                    host: n.netkey,
                                                    user: n.hash,
                                                    pass: "dum"
                                                },
                                                notify: {
                                                    type: "netunmount",
                                                    cnt: 1,
                                                    hideCnt: !0
                                                },
                                                preventDefault: !0
                                            }).done(function (e) {
                                                e.removed && (n.volumeid && delete d.volumeExpires[n.volumeid], l = l.concat(e.removed))
                                            }))
                                        }), e()
                                    }
                                },
                                cancel: {
                                    label: "btnCancel",
                                    callback: function () {
                                        p.reject()
                                    }
                                }
                            }) : (s = null, e())
                        }
                    },
                    cancel: {
                        label: "btnCancel",
                        callback: function () {
                            p.reject()
                        }
                    }
                }), p)
            }
        }, (Fe.prototype.commands.open = function () {
            var y = this.fm,
                n = this;
            this.alwaysEnabled = !0, this.noChangeDirOnRemovedCwd = !0, this._handlers = {
                dblclick: function (e) {
                    var t = e.data && e.data.file ? [e.data.file] : void 0;
                    0 === n.getstate(t) && (e.preventDefault(), y.exec("open", t))
                },
                "select enable disable reload": function (e) {
                    this.update("disable" == e.type ? -1 : void 0)
                }
            }, this.shortcuts = [{
                pattern: "ctrl+down numpad_enter" + ("mac" != y.OS && " enter")
            }], this.getstate = function (e) {
                var e = this.files(e),
                    t = e.length;
                return 1 == t ? e[0].read ? 0 : -1 : t && !y.UA.Mobile && st.grep(e, function (e) {
                    return !("directory" == e.mime || !e.read)
                }).length == t ? 0 : -1
            }, this.exec = function (t, e) {
                var r, s, l, c, d, p, n, u, h, i, f = st.Deferred().fail(function (e) {
                    e && y.error(e)
                }),
                    m = this.files(t),
                    g = m.length,
                    e = "object" == typeof e && e.thash,
                    v = this.options,
                    b = v.into || "window";
                if (!g && !e) return f.reject();
                if (e || 1 == g && (r = m[0]) && "directory" == r.mime) return e || !r || r.read ? y.keyState.ctrlKey && (y.keyState.shiftKey || "function" != typeof y.options.getFileCallback) && y.getCommand("opennew") ? y.exec("opennew", [e || r.hash]) : y.request({
                    data: {
                        cmd: "open",
                        target: e || r.hash
                    },
                    notify: {
                        type: "open",
                        cnt: 1,
                        hideCnt: !0
                    },
                    syncOnFail: !0,
                    lazy: !1
                }) : f.reject(["errOpen", r.name, "errPerm"]);
                if (m = st.grep(m, function (e) {
                    return "directory" != e.mime
                }), g != m.length) return f.reject();

                function a() {
                    function e(e) {
                        var i, t, n = st('<a rel="noopener">').hide().appendTo(st("body"));
                        if (y.UA.Mobile || !h) {
                            if (u) h ? n.attr("target", "_blank") : n.attr("download", r.name), n.attr("href", e).get(0).click();
                            else if (!(a = window.open(e))) return f.reject("errPopup")
                        } else {
                            if (!("string" == typeof v.method && "get" === v.method.toLowerCase()) && 0 === e.indexOf(y.options.url) && y.customData && Object.keys(y.customData).length && !r.mime.match(/^(?:video|audio)/) && (e = ""), !(a = "window" === b ? (l = d = Math.round(2 * screen.availWidth / 3), c = p = Math.round(2 * screen.availHeight / 3), parseInt(r.width) && parseInt(r.height) ? (l = parseInt(r.width), c = parseInt(r.height)) : r.dim && (s = r.dim.split("x"), l = parseInt(s[0]), c = parseInt(s[1])), l <= d && c <= p ? (d = l, p = c) : c - p < l - d ? p = Math.round(c * (d / l)) : d = Math.round(l * (p / c)), s = "width=" + d + ",height=" + p, window.open(e, o, s + ",top=50,left=50,scrollbars=yes,resizable=yes,titlebar=no")) : ("tabs" === b && (o = r.hash), window.open("about:blank", o)))) return f.reject("errPopup");
                            "" === e ? ((i = document.createElement("form")).action = y.options.url, i.method = "POST", i.target = o, i.style.display = "none", t = Object.assign({}, y.customData, {
                                cmd: "file",
                                target: r.hash,
                                _t: r.ts || parseInt(+new Date / 1e3)
                            }), st.each(t, function (e, t) {
                                var n = document.createElement("input");
                                n.name = e, n.value = t, i.appendChild(n)
                            }), document.body.appendChild(i), i.submit()) : "window" !== b && (a.location = e), st(a).trigger("focus")
                        }
                        n.remove()
                    }
                    var a, o;
                    try {
                        n = new RegExp(y.option("dispInlineRegex"), "i")
                    } catch (e) {
                        n = !1
                    }
                    for (u = "string" == typeof st("<a>").get(0).download, g = m.length; g--;) {
                        if (o = "elf_open_window", !(r = m[g]).read) return f.reject(["errOpen", r.name, "errPerm"]);
                        h = n && r.mime.match(n), y.openUrl(r.hash, !h, e)
                    }
                    f.resolve(t)
                }
                if (1 < g) y.confirm({
                    title: "openMulti",
                    text: ["openMultiConfirm", g + ""],
                    accept: {
                        label: "cmdopen",
                        callback: function () {
                            a()
                        }
                    },
                    cancel: {
                        label: "btnCancel",
                        callback: function () {
                            f.reject()
                        }
                    },
                    buttons: y.getCommand("zipdl") && y.isCommandEnabled("zipdl", y.cwd().hash) ? [{
                        label: "cmddownload",
                        callback: function () {
                            y.exec("download", t), f.reject()
                        }
                    }] : []
                });
                else {
                    if ((e = y.storage("selectAction") || v.selectAction) && (st.each(e.split("/"), function () {
                        var e = this.valueOf();
                        if ("open" !== e && (i = y.getCommand(e)) && i.enabled()) return !1;
                        i = null
                    }), i)) return y.exec(i.name);
                    a()
                }
                return f
            }
        }).prototype = {
            forceLoad: !0
        }, Fe.prototype.commands.opendir = function () {
            this.alwaysEnabled = !0, this.getstate = function () {
                return 1 === this.fm.selected().length && this.fm.getUI("workzone").hasClass("elfinder-search-result") ? 0 : -1
            }, this.exec = function (e) {
                var t = this.fm,
                    n = st.Deferred(),
                    e = this.files(e);
                return e.length && e[0].phash ? (e = e[0].phash, t.trigger("searchend", {
                    noupdate: !0
                }), t.request({
                    data: {
                        cmd: "open",
                        target: e
                    },
                    notify: {
                        type: "open",
                        cnt: 1,
                        hideCnt: !0
                    },
                    syncOnFail: !1
                }), n) : n.reject()
            }
        }, Fe.prototype.commands.opennew = function () {
            var e = this.fm;
            this.shortcuts = [{
                pattern: ("function" == typeof e.options.getFileCallback ? "shift+" : "") + "ctrl+enter"
            }], this.getstate = function (e) {
                e = this.files(e);
                return 1 === e.length && "directory" === e[0].mime && e[0].read ? 0 : -1
            }, this.exec = function (e) {
                var t, n, i = st.Deferred(),
                    e = this.files(e),
                    a = e.length,
                    o = this.options;
                return 1 === a && (a = e[0]) && "directory" === a.mime ? (e = window.location, t = o.url || e.pathname, o.useOriginQuery && (t.match(/\?/) ? e.search && (t += "&" + e.search.substr(1)) : t += e.search), t += "#elf_" + a.hash, n = window.open(t, "_blank"), setTimeout(function () {
                    n.focus()
                }, 1e3), i.resolve()) : i.reject()
            }
        }, Fe.prototype.commands.paste = function () {
            this.updateOnSelect = !1, this.handlers = {
                changeclipboard: function () {
                    this.update()
                }
            }, this.shortcuts = [{
                pattern: "ctrl+v shift+insert"
            }], this.getstate = function (e) {
                if (this._disabled) return -1;
                if (e) {
                    if (Array.isArray(e)) {
                        if (1 != e.length) return -1;
                        e = this.fm.file(e[0])
                    }
                } else e = this.fm.cwd();
                return this.fm.clipboard().length && "directory" == e.mime && e.write ? 0 : -1
            }, this.exec = function (e, t) {
                function n(a) {
                    function i(e, t) {
                        for (var n = [], i = e.length; i--;) - 1 !== st.inArray(e[i].name, t) && n.unshift(i);
                        return n
                    }

                    function t(e) {
                        var t, n = {};
                        e && (Array.isArray(e) ? e.length && ("string" == typeof e[0] ? o = i(a, e) : (st.each(e, function (e, t) {
                            n[t.name] = t.hash
                        }), o = i(a, st.map(n, function (e, t) {
                            return t
                        })), st.each(a, function (e, t) {
                            n[t.name] && (r[n[t.name]] = t.name)
                        }))) : (t = [], o = st.map(e, function (e) {
                            return "string" == typeof e ? e : (t = t.concat(e), !1)
                        }), t.length && (o = o.concat(t)), o = i(a, o), r = e)), o.length ? l(0) : c(a)
                    }
                    var e, s = st.Deferred(),
                        o = [],
                        r = {},
                        l = function (n) {
                            var e = o[n],
                                e = a[e],
                                i = n == o.length - 1;
                            e && p.confirm({
                                title: p.i18n(m + "Files"),
                                text: ["errExists", e.name, "restore" === m ? "confirmRest" : "confirmRepl"],
                                all: !i,
                                accept: {
                                    label: "btnYes",
                                    callback: function (e) {
                                        i || e ? c(a) : l(++n)
                                    }
                                },
                                reject: {
                                    label: "btnNo",
                                    callback: function (e) {
                                        var t;
                                        if (e)
                                            for (t = o.length; n < t--;) a[o[t]].remove = !0;
                                        else a[o[n]].remove = !0;
                                        i || e ? c(a) : l(++n)
                                    }
                                },
                                cancel: {
                                    label: "btnCancel",
                                    callback: function () {
                                        s.resolve()
                                    }
                                },
                                buttons: [{
                                    label: "btnBackup",
                                    callback: function (e) {
                                        var t;
                                        if (e)
                                            for (t = o.length; n < t--;) a[o[t]].rename = !0;
                                        else a[o[n]].rename = !0;
                                        i || e ? c(a) : l(++n)
                                    }
                                }]
                            })
                        },
                        c = function (e) {
                            var t, n = [],
                                i = st.grep(e, function (e) {
                                    return e.rename && n.push(e.name), !e.remove
                                }),
                                a = i.length;
                            if (!a) return s.resolve();
                            e = st.map(i, function (e) {
                                return e.hash
                            }), t = {
                                cmd: "paste",
                                dst: h.hash,
                                targets: e,
                                cut: f ? 1 : 0,
                                renames: n,
                                hashes: r,
                                suffix: p.options.backupSuffix
                            }, p.api < 2.1 && (t.src = i[0].phash), p.request({
                                data: t,
                                notify: {
                                    type: m,
                                    cnt: a
                                },
                                cancel: !0,
                                navigate: {
                                    toast: u.noToast ? {} : {
                                        inbuffer: {
                                            msg: p.i18n(["complete", p.i18n("cmd" + m)]),
                                            action: {
                                                cmd: "open",
                                                msg: "cmdopendir",
                                                data: [h.hash],
                                                done: "select",
                                                cwdNot: h.hash
                                            }
                                        }
                                    }
                                }
                            }).done(function (e) {
                                var o = {},
                                    r = e.added && e.added.length ? e.added : null;
                                f && r && (st.each(i, function (e, t) {
                                    var n, i, a = t.phash,
                                        t = (n = t.name, st.each(r, function (e, t) {
                                            if (t.name === n) return i = t.hash, !1
                                        }), i);
                                    t && (o[a] ? o[a].push(t) : o[a] = [t])
                                }), Object.keys(o).length && (e.undo = {
                                    cmd: "move",
                                    callback: function () {
                                        var n = [];
                                        return st.each(o, function (e, t) {
                                            n.push(p.request({
                                                data: {
                                                    cmd: "paste",
                                                    dst: e,
                                                    targets: t,
                                                    cut: 1
                                                },
                                                notify: {
                                                    type: "undo",
                                                    cnt: t.length
                                                }
                                            }))
                                        }), st.when.apply(null, n)
                                    }
                                }, e.redo = {
                                    cmd: "move",
                                    callback: function () {
                                        return p.request({
                                            data: t,
                                            notify: {
                                                type: "redo",
                                                cnt: a
                                            }
                                        })
                                    }
                                })), s.resolve(e)
                            }).fail(function (e) {
                                s.reject(), 0 === e && p.sync()
                            }).always(function () {
                                p.unlockfiles({
                                    files: i
                                })
                            })
                        };
                    return p.isCommandEnabled(d.name, h.hash) && a.length ? (!p.oldAPI && p.option("copyOverwrite", h.hash) ? (e = st.map(a, function (e) {
                        return e.name
                    }), h.hash == p.cwd().hash ? t(st.map(p.files(), function (e) {
                        return e.phash == h.hash ? {
                            hash: e.hash,
                            name: e.name
                        } : null
                    })) : p.request({
                        data: {
                            cmd: "ls",
                            target: h.hash,
                            intersect: e
                        },
                        notify: {
                            type: "prepare",
                            cnt: 1,
                            hideCnt: !0
                        },
                        preventFail: !0
                    }).always(function (e) {
                        t(e.list)
                    })) : c(a), s) : s.resolve()
                }
                var i, a, o, d = this,
                    p = d.fm,
                    u = t || {},
                    h = e ? this.files(e)[0] : p.cwd(),
                    r = p.clipboard(),
                    t = r.length,
                    f = !!t && r[0].cut,
                    m = u._cmd || (f ? "move" : "copy"),
                    s = "err" + m.charAt(0).toUpperCase() + m.substr(1),
                    l = [],
                    c = [],
                    g = st.Deferred().fail(function (e) {
                        e && p.error(e)
                    }).always(function () {
                        p.unlockfiles({
                            files: st.map(r, function (e) {
                                return e.hash
                            })
                        })
                    });
                return t && h && "directory" == h.mime ? h.write ? (i = p.parents(h.hash), st.each(r, function (e, t) {
                    return t.read ? f && t.locked ? !g.reject(["errLocked", t.name]) : -1 !== st.inArray(t.hash, i) ? !g.reject(["errCopyInItself", t.name]) : t.mime && "directory" !== t.mime && !p.uploadMimeCheck(t.mime, h.hash) ? !g.reject([s, t.name, "errUploadMime"]) : ((a = p.parents(t.hash)).pop(), -1 !== st.inArray(h.hash, a) && st.grep(a, function (e) {
                        e = p.file(e);
                        return e.phash == h.hash && e.name == t.name
                    }).length ? !g.reject(["errReplByChild", t.name]) : void (t.phash == h.hash ? c.push(t.hash) : l.push({
                        hash: t.hash,
                        phash: t.phash,
                        name: t.name
                    }))) : !g.reject([s, t.name, "errPerm"])
                }), "rejected" === g.state() || (o = st.Deferred(), f && d.options.moveConfirm ? p.confirm({
                    title: "moveFiles",
                    text: p.i18n("confirmMove", h.i18 || h.name),
                    accept: {
                        label: "btnYes",
                        callback: function () {
                            o.resolve()
                        }
                    },
                    cancel: {
                        label: "btnCancel",
                        callback: function () {
                            o.reject()
                        }
                    }
                }) : o.resolve(), o.done(function () {
                    var e;
                    st.when((e = c).length && p._commands.duplicate ? p.exec("duplicate", e) : st.Deferred().resolve(), n(l)).done(function (e, t) {
                        g.resolve(t && t.undo ? t : void 0)
                    }).fail(function () {
                        g.reject()
                    }).always(function () {
                        f && p.clipboard([])
                    })
                }).fail(function () {
                    g.reject()
                })), g) : g.reject([s, r[0].name, "errPerm"]) : g.reject()
            }
        }, Fe.prototype.commands.places = function () {
            var i = this,
                e = this.fm,
                a = null;
            this.getstate = function (e) {
                var t, e = this.hashes(e),
                    n = e.length;
                return a && n && n == (t = !0, st.grep(i.files(e), function (e) {
                    return t = !(!t || "directory" != e.mime)
                }).length) ? 0 : -1
            }, this.exec = function (e) {
                e = this.files(e);
                return a.trigger("regist", [e]), st.Deferred().resolve()
            }, e.one("load", function () {
                a = e.ui.places
            })
        }, Fe.prototype.commands.preference = function () {
            function n() {
                var n, e, t, i, a, o, r, s, l, c, d, p, u, h, f, m, g, v, b, y, w, x, k, C, z = I.options.categories || {
                    language: ["language"],
                    theme: ["theme"],
                    toolbar: ["toolbarPref"],
                    workspace: ["iconSize", "columnPref", "selectAction", "makefileTypes", "useStoredEditor", "editorMaximized", "useFullscreen", "showHidden"],
                    dialog: ["autoFocusDialog"],
                    selectionInfo: ["infoItems", "hashChecker"],
                    reset: ["clearBrowserData"],
                    all: !0
                },
                    T = I.options.prefs || ["language", "theme", "toolbarPref", "iconSize", "columnPref", "selectAction", "makefileTypes", "useStoredEditor", "editorMaximized", "useFullscreen", "showHidden", "infoItems", "hashChecker", "autoFocusDialog", "clearBrowserData"];

                function A() {
                    var i = [];
                    return d = M.getCommand("edit").getMkfileHides(), st.each(M.mimesCanMakeEmpty, function (e, t) {
                        var n = M.getCommand("mkfile").getTypeName(e, t);
                        i.push('<span class="elfinder-preference-column-item" title="' + M.escape(n) + '"><label><input type="checkbox" value="' + e + '" ' + (d[e] ? "" : "checked") + "/>" + t + "</label></span>")
                    }), i.join(" ")
                }

                function j() {
                    var e = M.storage("hide"),
                        n = [];
                    e && e.items && st.each(e.items, function (e, t) {
                        n.push(M.escape(t))
                    }), v.prop("disabled", !n.length)[n.length ? "removeClass" : "addClass"]("ui-state-disabled"), e = n.length ? n.join("\n") : "", T.showHidden.attr("title", e), m && T.showHidden.tooltip("option", "content", e.replace(/\n/g, "<br>")).tooltip("close")
                }
                M.cookieEnabled || delete z.language, T = M.arrayFlip(T, !0), M.options.getFileCallback && delete T.selectAction, M.UA.Fullscreen || delete T.useFullscreen, T.language && (T.language = (a = st("<select></select>").on("change", function () {
                    var e = st(this).val();
                    M.storage("lang", e), st("#" + M.id).elfinder("reload")
                }), n = [], e = I.options.langs || {
                    ar: "العربية",
                    bg: "Български",
                    ca: "Català",
                    cs: "Čeština",
                    da: "Dansk",
                    de: "Deutsch",
                    el: "Ελληνικά",
                    en: "English",
                    es: "Español",
                    fa: "فارسی",
                    fo: "Føroyskt",
                    fr: "Français",
                    fr_CA: "Français (Canada)",
                    he: "עברית",
                    hr: "Hrvatski",
                    hu: "Magyar",
                    id: "Bahasa Indonesia",
                    it: "Italiano",
                    ja: "日本語",
                    ko: "한국어",
                    nl: "Nederlands",
                    no: "Norsk",
                    pl: "Polski",
                    pt_BR: "Português",
                    ro: "Română",
                    ru: "Pусский",
                    si: "සිංහල",
                    sk: "Slovenčina",
                    sl: "Slovenščina",
                    sr: "Srpski",
                    sv: "Svenska",
                    tr: "Türkçe",
                    ug_CN: "ئۇيغۇرچە",
                    uk: "Український",
                    vi: "Tiếng Việt",
                    zh_CN: "简体中文",
                    zh_TW: "正體中文"
                }, M.cookieEnabled ? (st.each(e, function (e, t) {
                    n.push('<option value="' + e + '">' + t + "</option>")
                }), a.append(n.join("")).val(M.lang)) : st())), T.theme && (T.theme = function () {
                    var e = M.options.themes ? Object.keys(M.options.themes).length : 0;
                    if (0 === e || 1 === e && M.options.themes.default) return null;
                    var s = st("<select></select>").on("change", function () {
                        var e = st(this).val();
                        M.changeTheme(e).storage("theme", e)
                    }),
                        l = {
                            image: '<img class="elfinder-preference-theme elfinder-preference-theme-image" src="$2" />',
                            link: '<a href="$1" target="_blank" title="$3">$2</a>',
                            data: '<dt>$1</dt><dd><span class="elfinder-preference-theme elfinder-preference-theme-$0">$2</span></dd>'
                        },
                        c = ["image", "description", "author", "email", "license"],
                        e = st('<button class="ui-button ui-corner-all ui-widget elfinder-preference-theme-default"></button>').text(M.i18n("default")).on("click", function (e) {
                            s.val("default").trigger("change")
                        }),
                        i = st('<div class="elfinder-reference-hide-taball"></div>').on("click", "button", function () {
                            var e = st(this).data("themeid");
                            s.val(e).trigger("change")
                        });
                    return M.options.themes.default || s.append('<option value="default">' + M.i18n("default") + "</option>"), st.each(M.options.themes, function (o, e) {
                        var t, n = st('<option class="elfinder-theme-option-' + o + '" value="' + o + '">' + M.i18n(o) + "</option>"),
                            r = st('<fieldset class="ui-widget ui-widget-content ui-corner-all elfinder-theme-list-' + o + '"><legend>' + M.i18n(o) + '</legend><div><span class="elfinder-spinner"></span></div></fieldset>');
                        s.append(n), i.append(r), t = setTimeout(function () {
                            r.find("span.elfinder-spinner").replaceWith(M.i18n(["errRead", o]))
                        }, 1e4), M.getTheme(o).always(function () {
                            t && clearTimeout(t)
                        }).done(function (i) {
                            var e = st(),
                                a = st("<dl></dl>"),
                                t = i.link ? l.link.replace(/\$1/g, i.link).replace(/\$3/g, M.i18n("website")) : "$2";
                            i.name && n.html(M.i18n(i.name)), r.children("legend").html(t.replace(/\$2/g, M.i18n(i.name) || o)), st.each(c, function (e, t) {
                                var n = l[t] || l.data;
                                i[t] && (n = n.replace(/\$0/g, M.escape(t)).replace(/\$1/g, M.i18n(t)).replace(/\$2/g, M.i18n(i[t])), "image" === t && i.link && (n = st(n).on("click", function () {
                                    s.val(o).trigger("change")
                                }).attr("title", M.i18n("select"))), a.append(n))
                            }), e = (e = e.add(a)).add(st('<div class="elfinder-preference-theme-btn"></div>').append(st('<button class="ui-button ui-corner-all ui-widget"></button>').data("themeid", o).html(M.i18n("select")))), r.find("span.elfinder-spinner").replaceWith(e)
                        }).fail(function () {
                            r.find("span.elfinder-spinner").replaceWith(M.i18n(["errRead", o]))
                        })
                    }), st("<div></div>").append(s.val(M.theme && M.theme.id ? M.theme.id : "default"), e, i)
                }()), T.toolbarPref && (T.toolbarPref = (e = st.map(M.options.uiOptions.toolbar, function (e) {
                    return st.isArray(e) ? e : null
                }), t = [], i = M.storage("toolbarhides") || {}, st.each(e, function () {
                    var e = M.i18n("cmd" + this);
                    e === "cmd" + this && (e = M.i18n(this)), t.push('<span class="elfinder-preference-toolbar-item"><label><input type="checkbox" value="' + this + '" ' + (i[this] ? "" : "checked") + "/>" + e + "</label></span>")
                }), st(t.join(" ")).on("change", "input", function () {
                    var e = st(this).val(),
                        t = st(this).is(":checked");
                    t || i[e] ? t && i[e] && delete i[e] : i[e] = !0, M.storage("toolbarhides", i), M.trigger("toolbarpref")
                }))), T.iconSize && (T.iconSize = (a = M.options.uiOptions.cwd.iconsView.sizeMax || 3, r = M.storage("iconsize") || M.options.uiOptions.cwd.iconsView.size || 0, o = st('<div class="touch-punch"></div>').slider({
                    classes: {
                        "ui-slider-handle": "elfinder-tabstop"
                    },
                    value: r,
                    max: a,
                    slide: function (e, t) {
                        M.getUI("cwd").trigger("iconpref", {
                            size: t.value
                        })
                    },
                    change: function (e, t) {
                        M.storage("iconsize", t.value)
                    }
                }), M.getUI("cwd").on("iconpref", function (e, t) {
                    o.slider("option", "value", t.size)
                }), o)), T.columnPref && (T.columnPref = (r = M.options.uiOptions.cwd.listView.columns, s = [], l = M.storage("columnhides") || {}, st.each(r, function () {
                    var e = M.getColumnName(this);
                    s.push('<span class="elfinder-preference-column-item"><label><input type="checkbox" value="' + this + '" ' + (l[this] ? "" : "checked") + "/>" + e + "</label></span>")
                }), st(s.join(" ")).on("change", "input", function () {
                    var e = st(this).val(),
                        t = st(this).is(":checked");
                    t || l[e] ? t && l[e] && delete l[e] : l[e] = !0, M.storage("columnhides", l), M.trigger("columnpref", {
                        repaint: !0
                    })
                }))), T.selectAction && (T.selectAction = (h = st("<select></select>").on("change", function () {
                    var e = st(this).val();
                    M.storage("selectAction", "default" === e ? null : e)
                }), c = [], u = I.options.selectActions, f = M.getCommand("open").options.selectAction || "open", -1 === st.inArray(f, u) && u.unshift(f), st.each(u, function (e, t) {
                    var n = st.map(t.split("/"), function (e) {
                        var t = M.i18n("cmd" + e);
                        return t = t === "cmd" + e ? M.i18n(e) : t
                    });
                    c.push('<option value="' + t + '">' + n.join("/") + "</option>")
                }), h.append(c.join("")).val(M.storage("selectAction") || f))), T.makefileTypes && (T.makefileTypes = (d = M.getCommand("edit").getMkfileHides(), p = st("<div></div>").on("change", "input", function () {
                    var e = st(this).val(),
                        t = st(this).is(":checked");
                    t || d[e] ? t && d[e] && delete d[e] : d[e] = !0, M.storage("mkfileHides", d), M.trigger("canMakeEmptyFile")
                }).append(A()), u = st("<div></div>").append(st('<input type="text" placeholder="' + M.i18n("typeOfTextfile") + '"/>').on("keydown", function (e) {
                    e.keyCode === st.ui.keyCode.ENTER && st(this).next().trigger("click")
                }), st('<button class="ui-button"></button>').html(M.i18n("add")).on("click", function () {
                    function e() {
                        return a.appendTo(n.closest(".ui-dialog")), M.toast({
                            msg: M.i18n("errUsupportType"),
                            mode: "warning",
                            onHidden: function () {
                                1 === a.children().length && a.appendTo(M.getUI())
                            }
                        }), n.trigger("focus"), !1
                    }
                    var t, n = st(this).prev(),
                        i = n.val(),
                        a = M.getUI("toast");
                    if (!i.match(/\//)) {
                        if (!(i = M.arrayFlip(M.mimeTypes)[i])) return e();
                        n.val(i)
                    }
                    if (!M.mimeIsText(i) || !M.mimeTypes[i]) return e();
                    M.trigger("canMakeEmptyFile", {
                        mimes: [i],
                        unshift: !0
                    }), (t = {})[i] = M.mimeTypes[i], M.storage("mkfileTextMimes", Object.assign(t, M.storage("mkfileTextMimes") || {})), n.val(""), a.appendTo(n.closest(".ui-dialog")), M.toast({
                        msg: M.i18n(["complete", i + " (" + t[i] + ")"]),
                        onHidden: function () {
                            1 === a.children().length && a.appendTo(M.getUI())
                        }
                    })
                }), st('<button class="ui-button"></button>').html(M.i18n("reset")).on("click", function () {
                    M.one("canMakeEmptyFile", {
                        done: function () {
                            p.empty().append(A())
                        }
                    }), M.trigger("canMakeEmptyFile", {
                        resetTexts: !0
                    })
                })), M.bind("canMakeEmptyFile", {
                    done: function (e) {
                        e.data && e.data.mimes && e.data.mimes.length && p.empty().append(A())
                    }
                }), st("<div></div>").append(p, u))), T.useStoredEditor && (T.useStoredEditor = st('<input type="checkbox"/>').prop("checked", (h = M.storage("useStoredEditor")) ? 0 < h : M.options.commandsOptions.edit.useStoredEditor).on("change", function (e) {
                    M.storage("useStoredEditor", st(this).is(":checked") ? 1 : -1)
                })), T.editorMaximized && (T.editorMaximized = st('<input type="checkbox"/>').prop("checked", (f = M.storage("editorMaximized")) ? 0 < f : M.options.commandsOptions.edit.editorMaximized).on("change", function (e) {
                    M.storage("editorMaximized", st(this).is(":checked") ? 1 : -1)
                })), T.useFullscreen && (T.useFullscreen = st('<input type="checkbox"/>').prop("checked", (g = M.storage("useFullscreen")) ? 0 < g : "screen" === M.options.commandsOptions.fullscreen.mode).on("change", function (e) {
                    M.storage("useFullscreen", st(this).is(":checked") ? 1 : -1)
                })), T.showHidden && (g = st('<input type="checkbox"/>').prop("checked", (g = M.storage("hide")) && g.show).on("change", function (e) {
                    var t = {};
                    t[st(this).is(":checked") ? "show" : "hide"] = !0, M.exec("hide", void 0, t)
                }), b = st('<button class="ui-button ui-corner-all ui-widget"></button>').append(M.i18n("reset")).on("click", function () {
                    M.exec("hide", void 0, {
                        reset: !0
                    }), st(this).parent().find("input:first").prop("checked", !1), j()
                }), v = st().add(g).add(b), T.showHidden = st("<div></div>").append(g, b), M.bind("hide", function (e) {
                    e = e.data;
                    e.opts && (e.opts.show || e.opts.hide) || j()
                }), M.UA.Mobile && st.fn.tooltip && (m = !0, T.showHidden.tooltip({
                    classes: {
                        "ui-tooltip": "elfinder-ui-tooltip ui-widget-shadow"
                    },
                    tooltipClass: "elfinder-ui-tooltip ui-widget-shadow",
                    track: !0
                }).css("user-select", "none"), b.css("user-select", "none")), j()), T.infoItems && (T.infoItems = (b = M.getCommand("info").items, y = [], w = M.storage("infohides") || M.arrayFlip(M.options.commandsOptions.info.hideItems, !0), st.each(b, function () {
                    var e = M.i18n(this);
                    y.push('<span class="elfinder-preference-info-item"><label><input type="checkbox" value="' + this + '" ' + (w[this] ? "" : "checked") + "/>" + e + "</label></span>")
                }), st(y.join(" ")).on("change", "input", function () {
                    var e = st(this).val(),
                        t = st(this).is(":checked");
                    t || w[e] ? t && w[e] && delete w[e] : w[e] = !0, M.storage("infohides", w), M.trigger("infopref", {
                        repaint: !0
                    })
                }))), T.hashChecker && M.hashCheckers.length && (T.hashChecker = (x = [], k = M.arrayFlip(M.storage("hashchekcer") || M.options.commandsOptions.info.showHashAlgorisms, !0), st.each(M.hashCheckers, function () {
                    var e = M.i18n(this);
                    x.push('<span class="elfinder-preference-hashchecker-item"><label><input type="checkbox" value="' + this + '" ' + (k[this] ? "checked" : "") + "/>" + e + "</label></span>")
                }), st(x.join(" ")).on("change", "input", function () {
                    var e = st(this).val();
                    st(this).is(":checked") ? k[e] = !0 : k[e] && delete k[e], M.storage("hashchekcer", st.grep(M.hashCheckers, function (e) {
                        return k[e]
                    }))
                }))), T.autoFocusDialog && (T.autoFocusDialog = st('<input type="checkbox"/>').prop("checked", (C = M.storage("autoFocusDialog")) ? 0 < C : M.options.uiOptions.dialog.focusOnMouseOver).on("change", function (e) {
                    M.storage("autoFocusDialog", st(this).is(":checked") ? 1 : -1)
                })), T.clearBrowserData && (T.clearBrowserData = st("<button></button>").text(M.i18n("reset")).button().on("click", function (e) {
                    e.preventDefault(), M.storage(), st("#" + M.id).elfinder("reload")
                })), st.each(z, function (e, t) {
                    var r, s;
                    !0 === t ? s = 1 : t && (r = st(), st.each(t, function (e, t) {
                        var n, i, a, o = "";
                        (n = T[t]) && (s = 2, i = M.i18n(t), 1 === (a = (a = st(n).filter('input[type="checkbox"]')).length ? a : st(n).find('input[type="checkbox"]')).length ? (a.attr("id") || a.attr("id", "elfinder-preference-" + t + "-checkbox"), i = '<label for="' + a.attr("id") + '">' + i + "</label>") : 1 < a.length && (o = " elfinder-preference-checkboxes"), r = r.add(st('<dt class="elfinder-preference-' + t + o + '">' + i + "</dt>")).add(st('<dd class="elfinder-preference-' + t + o + '"></dd>').append(n)))
                    })), s && (U.append(D[E](/\{id\}/g, e)[E](/\{title\}/, M.i18n(e))[E](/\{class\}/, O === e ? "elfinder-focus" : "")), 2 === s && P.append(st('<div id="' + M.namespace + "-preference-" + e + '" class="elfinder-preference-content"></div>').hide().append(st("<dl></dl>").append(r))))
                }), U.on("click", "a", function (e) {
                    var t = st(e.target),
                        n = t.attr("href");
                    e.preventDefault(), e.stopPropagation(), U.children().removeClass(R), t.removeClass("ui-state-hover").parent().addClass(R), n.match(/all$/) ? P.addClass("elfinder-preference-taball").children().show() : (P.removeClass("elfinder-preference-taball").children().hide(), st(n).show())
                }).on("focus blur", "a", function (e) {
                    st(this).parent().toggleClass("ui-state-focus", "focusin" === e.type)
                }).on("mouseenter mouseleave", "li", function (e) {
                    st(this).toggleClass("ui-state-hover", "mouseenter" === e.type)
                }), P.find("a,input,select,button").addClass("elfinder-tabstop"), F.append(U, P), (S = I.fmDialog(F, {
                    title: I.title,
                    width: I.options.width || 600,
                    height: I.options.height || 400,
                    maxWidth: "window",
                    maxHeight: "window",
                    autoOpen: !1,
                    destroyOnClose: !1,
                    allowMinimize: !1,
                    open: function () {
                        O && q(O), O = null
                    },
                    resize: function () {
                        P.height(S.height() - U.outerHeight(!0) - (P.outerHeight(!0) - P.height()) - 5)
                    }
                }).on("click", function (e) {
                    e.stopPropagation()
                }).css({
                    overflow: "hidden"
                })).closest(".ui-dialog").css({
                    overflow: "hidden"
                }).addClass("elfinder-bg-translucent"), O = "all"
            }
            var S, O, I = this,
                M = this.fm,
                E = "replace",
                D = '<li class="' + M.res("class", "tabstab") + ' elfinder-preference-tab-{id}"><a href="#' + M.namespace + '-preference-{id}" id="' + M.namespace + '-preference-tab-{id}" class="ui-tabs-anchor {class}">{title}</a></li>',
                F = st('<div class="ui-tabs ui-widget ui-widget-content ui-corner-all elfinder-preference">'),
                U = st('<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-top">'),
                P = st('<div class="elfinder-preference-tabs ui-tabs-panel ui-widget-content ui-corner-bottom"></div>'),
                q = (st("base").length && document.location.href.replace(/#.*$/, ""), function (e) {
                    st("#" + M.namespace + "-preference-tab-" + e).trigger("mouseover").trigger("click"), O = e
                }),
                R = M.res("class", "tabsactive");
            this.shortcuts = [{
                pattern: "ctrl+comma",
                description: this.title
            }], this.alwaysEnabled = !0, this.getstate = function () {
                return 0
            }, this.exec = function (e, t) {
                return S || n(), t && (t.tab ? q(t.tab) : "cwd" === t._currentType && q("workspace")), S.elfinderdialog("open"), st.Deferred().resolve()
            }
        }, (Fe.prototype.commands.quicklook = function () {
            function t(e) {
                st(document).trigger(st.Event("keydown", {
                    keyCode: e,
                    ctrlKey: !1,
                    shiftKey: !1,
                    altKey: !1,
                    metaKey: !1
                }))
            }

            function l(e) {
                var t = g.getUI().offset(),
                    n = (n = e.find(".elfinder-cwd-file-wrapper")).length ? n : e,
                    e = n.offset() || {
                        top: 0,
                        left: 0
                    };
                return {
                    opacity: 0,
                    width: n.width(),
                    height: n.height() - 30,
                    top: e.top - t.top,
                    left: e.left - t.left
                }
            }

            function e(e, t) {
                var t = t || e.substr(0, e.indexOf("/")),
                    t = a[t] || (a[t] = document.createElement(t)),
                    n = !1;
                try {
                    n = t.canPlayType && t.canPlayType(e)
                } catch (e) { }
                return !(!n || "" === n || "no" == n)
            }

            function n() {
                m.update(void 0, function () {
                    var n, e = m.fm,
                        t = e.selectedFiles(),
                        i = t.length;
                    m.docked();
                    return i || (i = 1, t = [e.cwd()]), 1 === i ? t[0] : (n = 0, st.each(t, function (e, t) {
                        t = parseInt(t.ts);
                        0 <= n ? n < t && (n = t) : n = "unknown"
                    }), {
                        hash: t[0].hash + "/" + +new Date,
                        name: e.i18n("items") + ": " + i,
                        mime: "group",
                        size: B,
                        ts: n,
                        files: st.map(t, function (e) {
                            return e.hash
                        }),
                        getSize: !0
                    })
                }())
            }
            var c, d, o, r, s, p, u, h, f, i, m = this,
                g = m.fm,
                v = 0,
                b = Element.update ? "quicklookupdate" : "update",
                y = "elfinder-quicklook-navbar-icon",
                w = "elfinder-quicklook-fullscreen",
                x = "elfinder-quicklook-info-wrapper",
                a = {},
                P = -1 != window.navigator.platform.indexOf("Win"),
                q = !1,
                k = !1,
                C = !1,
                z = null,
                R = st.ui.keyCode.LEFT,
                H = st.ui.keyCode.RIGHT,
                _ = "mousemove touchstart " + ("onwheel" in document ? "wheel" : "onmousewheel" in document ? "mousewheel" : "DOMMouseScroll"),
                N = st('<span class="elfinder-dialog-title elfinder-quicklook-title"></span>'),
                T = st("<div></div>"),
                A = st('<div class="elfinder-quicklook-info"></div>'),
                j = st('<div class="ui-front elfinder-quicklook-cover"></div>'),
                L = st('<div class="' + y + " " + y + '-fullscreen"></div>').on("click touchstart", function (e) {
                    var t, n, i, a;
                    C || (n = (t = m.window).hasClass(w), i = st(window), a = function () {
                        m.preview.trigger("changesize")
                    }, e.stopPropagation(), e.preventDefault(), n ? (F = "", S(), t.toggleClass(w).css(t.data("position")), i.trigger(m.resize).off(m.resize, a), E.off("mouseenter mouseleave"), j.off(_)) : (t.toggleClass(w).data("position", {
                        left: t.css("left"),
                        top: t.css("top"),
                        width: t.width(),
                        height: t.height(),
                        display: "block"
                    }).removeAttr("style"), st(window).on(m.resize, a).trigger(m.resize), j.on(_, function (e) {
                        k || ("mousemove" !== e.type && "touchstart" !== e.type || (S(), z = setTimeout(function () {
                            (g.UA.Mobile || E.parent().find(".elfinder-quicklook-navbar:hover").length < 1) && E.fadeOut("slow", function () {
                                j.show()
                            })
                        }, 3e3)), j.is(":visible") && (O(), j.data("tm", setTimeout(function () {
                            j.show()
                        }, 3e3))))
                    }).show().trigger("mousemove"), E.on("mouseenter mouseleave", function (e) {
                        k || ("mouseenter" === e.type ? S() : j.trigger("mousemove"))
                    })), g.zIndex && t.css("z-index", g.zIndex + 1), g.UA.Mobile ? E.attr("style", F) : E.attr("style", F).draggable(n ? "destroy" : {
                        start: function () {
                            C = k = !0, j.show(), S()
                        },
                        stop: function () {
                            k = !1, F = m.navbar.attr("style"), requestAnimationFrame(function () {
                                C = !1
                            })
                        }
                    }), st(this).toggleClass(y + "-fullscreen-off"), e = t, (e = r.is(".ui-resizable") ? e.add(r) : e).resizable(n ? "enable" : "disable").removeClass("ui-state-disabled"), t.trigger("viewchange"))
                }),
                S = function () {
                    m.window.hasClass(w) && (z && clearTimeout(z), z = null, E.stop(!0, !0).css("display", "block"), O())
                },
                O = function () {
                    j.data("tm") && clearTimeout(j.data("tm")), j.removeData("tm"), j.hide()
                },
                I = st('<div class="' + y + " " + y + '-prev"></div>').on("click touchstart", function (e) {
                    return C || t(R), !1
                }),
                M = st('<div class="' + y + " " + y + '-next"></div>').on("click touchstart", function (e) {
                    return C || t(H), !1
                }),
                E = st('<div class="elfinder-quicklook-navbar"></div>').append(I).append(L).append(M).append('<div class="elfinder-quicklook-navbar-separator"></div>').append(st('<div class="' + y + " " + y + '-close"></div>').on("click touchstart", function (e) {
                    return C || m.window.trigger("close"), !1
                })),
                W = st('<span class="ui-front ui-icon elfinder-icon-close ui-icon-closethick"></span>').on("mousedown", function (e) {
                    e.stopPropagation(), m.window.trigger("close")
                }),
                D = st('<span class="ui-front ui-icon elfinder-icon-minimize ui-icon-minusthick"></span>').on("mousedown", function (e) {
                    e.stopPropagation(), m.docked() ? m.window.trigger("navdockout") : m.window.trigger("navdockin")
                }),
                B = '<span class="elfinder-spinner-text">' + g.i18n("calc") + '</span><span class="elfinder-spinner"></span>',
                F = "",
                U = !0;
            this.flags = {}, this.cover = j, this.evUpdate = b, (this.navbar = E)._show = S, this.resize = "resize." + g.namespace, this.info = st("<div></div>").addClass(x).append(T).append(A), this.autoPlay = function () {
                return !!m.opened() && !!m.options[m.docked() ? "dockAutoplay" : "autoplay"]
            }, this.preview = st('<div class="elfinder-quicklook-preview ui-helper-clearfix"></div>').on("change", function () {
                S(), E.attr("style", F), m.docked() && E.hide(), m.preview.attr("style", "").removeClass("elfinder-overflow-auto"), m.info.attr("style", "").hide(), m.cover.removeClass("elfinder-quicklook-coverbg"), T.removeAttr("class").attr("style", ""), A.html("")
            }).on(b, function (e) {
                m.preview;
                var t, n, i, a = e.file,
                    o = '<div class="elfinder-quicklook-info-data">{value}</div>',
                    r = [];
                (a = a && !Object.keys(a).length ? g.cwd() : a) && h && "pending" === h.state() && h._hash !== a.hash && h.reject(), a && (e.forceUpdate || m.window.data("hash") !== a.hash) ? (i = m.window.css("overflow", "hidden"), n = g.escape(a.i18 || a.name), a.read || e.stopImmediatePropagation(), m.window.data("hash", a.hash), m.preview.off("changesize").trigger("change").children().remove(), N.html(n), I.css("visibility", ""), M.css("visibility", ""), a.hash === g.cwdId2Hash(s.find("[id]:not(.elfinder-cwd-parent):first").attr("id")) && I.css("visibility", "hidden"), a.hash === g.cwdId2Hash(s.find("[id]:last").attr("id")) && M.css("visibility", "hidden"), "directory" === a.mime ? r = [a.hash] : "group" === a.mime && a.getSize && (r = a.files), A.html(o.replace(/\{value\}/, n) + o.replace(/\{value\}/, g.mime2kind(a)) + o.replace(/\{value\}/, r.length ? B : g.formatSize(a.size)) + o.replace(/\{value\}/, g.i18n("modify") + ": " + g.formatDate(a))), r.length && ((h = g.getSize(r).done(function (e) {
                    A.find("span.elfinder-spinner").parent().html(e.formated)
                }).fail(function () {
                    A.find("span.elfinder-spinner").parent().html(g.i18n("unknown"))
                }).always(function () {
                    h = null
                }))._hash = a.hash), T.addClass("elfinder-cwd-icon ui-corner-all " + g.mime2class(a.mime)), a.icon && T.css(g.getIconStyle(a, !0)), m.info.attr("class", x), a.csscls && m.info.addClass(a.csscls), a.read && (t = g.tmb(a)) && st("<img/>").hide().appendTo(m.preview).on("load", function () {
                    T.addClass(t.className).css("background-image", "url('" + t.url + "')"), st(this).remove()
                }).attr("src", t.url), m.info.delay(100).fadeIn(10), m.window.hasClass(w) && j.trigger("mousemove"), i.css("overflow", "")) : e.stopImmediatePropagation()
            }), this.window = st('<div class="ui-front ui-helper-reset ui-widget elfinder-quicklook touch-punch" style="position:absolute"></div>').hide().addClass(g.UA.Touch ? "elfinder-touch" : "").on("click", function (e) {
                var t = this;
                e.stopPropagation(), 2 === v && requestAnimationFrame(function () {
                    2 === v && g.toFront(t)
                })
            }).append(st('<div class="ui-dialog-titlebar ui-widget-header ui-corner-top ui-helper-clearfix elfinder-quicklook-titlebar"></div>').append(st('<span class="ui-widget-header ui-dialog-titlebar-close ui-corner-all elfinder-titlebar-button elfinder-quicklook-titlebar-icon' + (P ? " elfinder-titlebar-button-right" : "") + '"></span>').append(W, D), N), this.preview, m.info.hide(), j.hide(), E).draggable({
                handle: "div.elfinder-quicklook-titlebar"
            }).on("open", function (e, t) {
                function n(e) {
                    v = e, m.update(1, m.value), m.change(), o.trigger("resize." + g.namespace)
                }
                var i, a, o = m.window,
                    r = m.value,
                    s = g.getUI("cwd");
                U || 0 !== v ? 4 === v && (g.getUI("navdock").data("addNode")(f), n(3), m.preview.trigger("changesize"), g.storage("previewDocked", "1"), 0 === g.getUI("navdock").width() && o.trigger("navdockout")) : (r && r.hash !== p && (s = g.cwdHash2Elm(r.hash.split("/", 2)[0])), F = "", E.attr("style", ""), v = 1, s.trigger("scrolltoview"), O(), o.css(t || l(s)).show().animate((r = m.options.contain || g.options.dialogContained, t = r ? g.getUI() : st(window), s = g.getUI().offset(), i = Math.min(c, t.width() - 10), a = Math.min(d, t.height() - 80), {
                    opacity: 1,
                    width: i,
                    height: a,
                    top: parseInt((t.height() - a - 60) / 2 + (r ? 0 : t.scrollTop() - s.top)),
                    left: parseInt((t.width() - i) / 2 + (r ? 0 : t.scrollLeft() - s.left))
                }), 550, function () {
                    n(2), S()
                }), g.toFront(o))
            }).on("close", function (e, n) {
                function t(e, t) {
                    v = e, t && g.toHide(i), a.children().remove(), m.update(0, m.value), i.data("hash", ""), n && n.resolve()
                }
                var i = m.window,
                    a = m.preview.trigger("change"),
                    o = (m.value, (i.data("hash") || "").split("/", 2)[0]);
                m.opened() && (h && "pending" === h.state() && h.reject(), m.docked() ? (f = g.getUI("navdock").data("removeNode")(m.window.attr("id"), "detach"), t(4), g.storage("previewDocked", "2")) : (v = 1, i.hasClass(w) && L.click(), o && (o = s.find("#" + o)).length ? i.animate(l(o), 500, function () {
                    a.off("changesize"), t(0, !0)
                }) : t(0, !0)))
            }).on("navdockin", function (e, t) {
                var n = m.window,
                    i = g.getUI("navdock"),
                    a = u || i.width(),
                    t = t || {};
                U && (t.init = !0), v = 3, o = n.attr("style"), n.toggleClass("ui-front").removeClass("ui-widget").draggable("disable").resizable("disable").removeAttr("style").css({
                    width: "100%",
                    height: a,
                    boxSizing: "border-box",
                    paddingBottom: 0,
                    zIndex: "unset"
                }), E.hide(), D.toggleClass("ui-icon-plusthick ui-icon-minusthick elfinder-icon-full elfinder-icon-minimize"), g.toHide(n, !0), i.data("addNode")(n, t), m.preview.trigger("changesize"), g.storage("previewDocked", "1")
            }).on("navdockout", function (e) {
                var t = m.window,
                    n = g.getUI("navdock"),
                    i = (st.Deferred(), l(m.preview));
                u = t.outerHeight(), n.data("removeNode")(t.attr("id"), g.getUI()), t.toggleClass("ui-front").addClass("ui-widget").draggable("enable").resizable("enable").attr("style", o), D.toggleClass("ui-icon-plusthick ui-icon-minusthick elfinder-icon-full elfinder-icon-minimize"), v = 0, t.trigger("open", i), g.storage("previewDocked", "0")
            }).on("resize." + g.namespace, function () {
                m.preview.trigger("changesize")
            }), this.alwaysEnabled = !0, this.value = null, this.handlers = {
                select: function (e, t) {
                    i && cancelAnimationFrame(i), e.data && e.data.selected && e.data.selected.length ? m.opened() && n() : i = requestAnimationFrame(function () {
                        m.opened() && n()
                    })
                },
                error: function () {
                    m.window.is(":visible") && m.window.trigger("close")
                },
                "searchshow searchhide": function () {
                    this.opened() && this.window.trigger("close")
                },
                navbarshow: function () {
                    requestAnimationFrame(function () {
                        m.docked() && m.preview.trigger("changesize")
                    })
                },
                destroy: function () {
                    m.window.remove()
                }
            }, this.shortcuts = [{
                pattern: "space"
            }], this.support = {
                audio: {
                    ogg: e("audio/ogg;"),
                    webm: e("audio/webm;"),
                    mp3: e("audio/mpeg;"),
                    wav: e("audio/wav;"),
                    m4a: e("audio/mp4;") || e("audio/x-m4a;") || e("audio/aac;"),
                    flac: e("audio/flac;"),
                    amr: e("audio/amr;")
                },
                video: {
                    ogg: e("video/ogg;"),
                    webm: e("video/webm;"),
                    mp4: e("video/mp4;"),
                    mkv: e("video/x-matroska;") || e("video/webm;"),
                    "3gp": e("video/3gpp;") || e("video/mp4;"),
                    m3u8: e("application/x-mpegURL", "video") || e("application/vnd.apple.mpegURL", "video"),
                    mpd: e("application/dash+xml", "video")
                }
            }, a = {}, this.closed = function () {
                return 0 == v || 4 == v
            }, this.opened = function () {
                return 2 == v || 3 == v
            }, this.docked = function () {
                return 3 == v
            }, this.addIntegration = function (e) {
                requestAnimationFrame(function () {
                    g.trigger("helpIntegration", Object.assign({
                        cmd: "quicklook"
                    }, e))
                })
            }, this.init = function () {
                var a, o = this.options,
                    t = this.window,
                    e = this.preview;
                c = 0 < o.width ? parseInt(o.width) : 450, d = 0 < o.height ? parseInt(o.height) : 300, "auto" !== o.dockHeight && (u = (u = parseInt(o.dockHeight)) || void 0), g.one("load", function () {
                    (q = g.getUI("navdock").data("dockEnabled")) || D.hide(), r = g.getUI(), s = g.getUI("cwd"), g.zIndex && t.css("z-index", g.zIndex + 1), t.appendTo(r), st(document).on("keydown." + g.namespace, function (e) {
                        e.keyCode == st.ui.keyCode.ESCAPE && m.opened() && !m.docked() && t.hasClass("elfinder-frontmost") && t.trigger("close")
                    }), t.resizable({
                        handles: "se",
                        minWidth: 350,
                        minHeight: 120,
                        resize: function () {
                            e.trigger("changesize")
                        }
                    }), m.change(function () {
                        m.opened() && m.value && (m.value.tmb && 1 == m.value.tmb && (m.value = Object.assign({}, g.file(m.value.hash))), e.trigger(st.Event(b, {
                            file: m.value
                        })))
                    }), e.on(b, function (e) {
                        var t, n, i;
                        if (t = e.file) {
                            if (n = t.hash, i = g.searchStatus.mixed && 1 < g.searchStatus.state, "directory" !== t.mime)
                                if (parseInt(t.size) || t.mime.match(o.mimeRegexNotEmptyCheck)) {
                                    if (m.dispInlineRegex = a, i || g.optionsByHashes[n]) try {
                                        m.dispInlineRegex = new RegExp(g.option("dispInlineRegex", n), "i")
                                    } catch (e) {
                                        try {
                                            m.dispInlineRegex = new RegExp(g.isRoot(t) ? g.options.dispInlineRegex : g.option("dispInlineRegex", t.phash), "i")
                                        } catch (e) {
                                            m.dispInlineRegex = /^$/
                                        }
                                    }
                                } else e.stopImmediatePropagation();
                            else m.dispInlineRegex = /^$/;
                            m.info.show()
                        } else e.stopImmediatePropagation()
                    }), st.each(g.commands.quicklook.plugins || [], function (e, t) {
                        "function" == typeof t && new t(m)
                    })
                }).one("open", function () {
                    var e, t = Number(g.storage("previewDocked") || o.docked);
                    q && 1 <= t && (e = m.window, m.exec(), e.trigger("navdockin", {
                        init: !0
                    }), 2 === t ? e.trigger("close") : (m.update(void 0, g.cwd()), m.change())), U = !1
                }).bind("open", function () {
                    p = g.cwd().hash, m.value = g.cwd();
                    try {
                        a = new RegExp(g.option("dispInlineRegex"), "i")
                    } catch (e) {
                        a = /^$/
                    }
                }).bind("change", function (e) {
                    e.data && e.data.changed && m.opened() && st.each(e.data.changed, function () {
                        if (m.window.data("hash") === this.hash) return m.window.data("hash", null), m.preview.trigger(b), !1
                    })
                }).bind("navdockresizestart navdockresizestop", function (e) {
                    j["navdockresizestart" === e.type ? "show" : "hide"]()
                })
            }, this.getstate = function () {
                return m.opened() ? 1 : 0
            }, this.exec = function () {
                return m.closed() && n(), m.enabled() && m.window.trigger(m.opened() ? "close" : "open"), st.Deferred().resolve()
            }, this.hideinfo = function () {
                this.info.stop(!0, !0).hide()
            }
        }).prototype = {
            forceLoad: !0
        }, Fe.prototype.commands.quicklook.plugins = [function (d) {
            var p, u = ["image/jpeg", "image/png", "image/gif", "image/svg+xml", "image/x-ms-bmp"],
                h = d.fm.returnBytes(d.options.getDimThreshold || 0),
                f = d.preview,
                e = new Image;
            e.onload = e.onerror = function () {
                2 == e.height && u.push("image/webp")
            }, e.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA", st.each(navigator.mimeTypes, function (e, t) {
                t = t.type;
                0 === t.indexOf("image/") && st.inArray(t, u) && u.push(t)
            }), f.on(d.evUpdate, function (e) {
                function i(e) {
                    var t = r.file(s.hash);
                    t.width = e[0], t.height = e[1]
                }

                function t() {
                    var e, t, n, a;
                    c && c.state && "pending" === c.state() && c.reject(), l || (l = !0, n = o.get(0), (e = s.width && s.height ? {
                        w: s.width,
                        h: s.height
                    } : n.naturalWidth ? null : {
                        w: o.width(),
                        h: o.height()
                    }) && o.removeAttr("width").removeAttr("height"), t = s.width || n.naturalWidth || n.width || o.width(), n = s.height || n.naturalHeight || n.height || o.height(), s.width && s.height || i([t, n]), e && o.width(e.w).height(e.h), a = (t / n).toFixed(2), f.on("changesize", function () {
                        var e, t, n = parseInt(f.width()),
                            i = parseInt(f.height());
                        a < (n / i).toFixed(2) ? (t = i, e = Math.floor(t * a)) : (e = n, t = Math.floor(e / a)), o.width(e).height(t).css("margin-top", t < i ? Math.floor((i - t) / 2) : 0)
                    }).trigger("changesize"), o.fadeIn(100))
                }
                var o, n, a, r = d.fm,
                    s = e.file,
                    l = !1,
                    c = null;
                (p = p || r.arrayFlip(u))[s.mime] && d.dispInlineRegex.test(s.mime) && (e.stopImmediatePropagation(), n = st('<div class="elfinder-quicklook-info-data"><span class="elfinder-spinner-text">' + r.i18n("nowLoading") + '</span><span class="elfinder-spinner"></span></div>').appendTo(d.info.find(".elfinder-quicklook-info")), e = st('<div class="elfinder-quicklook-info-progress"></div>').appendTo(n), o = st("<img/>").hide().appendTo(f).on("load", function () {
                    n.remove(), d.hideinfo(), t()
                }).on("error", function () {
                    n.remove()
                }), a = r.openUrl(s.hash, !1, function (e) {
                    o.attr("src", e)
                }, {
                    progressBar: e
                }), f.one("change", function () {
                    a && a.state && "pending" === a.state() && a.reject()
                }), s.width && s.height ? t() : s.size > h && (c = r.request({
                    data: {
                        cmd: "dim",
                        target: s.hash
                    },
                    preventDefault: !0
                }).done(function (e) {
                    e.dim && (e = e.dim.split("x"), s.width = e[0], s.height = e[1], i(e), t())
                })))
            })
        }, function (c) {
            var d = c.fm,
                p = c.preview;
            window.Worker && window.Uint8Array && p.on(c.evUpdate, function (e) {
                function t(e) {
                    s && s.terminate(), i.remove(), d.debug("error", e)
                }
                var i, r, s, n, l = e.file;
                "image/tiff" === l.mime && (e.stopImmediatePropagation(), i = st('<div class="elfinder-quicklook-info-data"><span class="elfinder-spinner-text">' + d.i18n("nowLoading") + '</span><span class="elfinder-spinner"></span></div>').appendTo(c.info.find(".elfinder-quicklook-info")), e = st('<div class="elfinder-quicklook-info-progress"></div>').appendTo(i), p.one("change", function () {
                    s && s.terminate(), i.remove()
                }), n = d.getContents(l.hash, "arraybuffer", {
                    progressBar: e
                }).done(function (e) {
                    if (e) {
                        r = st("<div></div>").css({
                            width: "100%",
                            height: "100%"
                        }).hide().appendTo(p);
                        try {
                            (s = d.getWorker()).onmessage = function (e) {
                                var a, o, t, n, e = e.data;
                                s && s.terminate(), t = (a = document.createElement("canvas")).getContext("2d"), a.width = e.width, a.height = e.height, (n = t.createImageData(e.width, e.height)).data.set(new Uint8Array(e.image)), t.putImageData(n, 0, 0), r.append(a).show(), i.remove(), o = (e.width / e.height).toFixed(2), p.on("changesize", function () {
                                    var e, t, n = parseInt(p.width()),
                                        i = parseInt(p.height());
                                    o < (n / i).toFixed(2) ? (t = i, e = Math.floor(t * o)) : (e = n, t = Math.floor(e / o)), st(a).width(e).height(t).css("margin-top", t < i ? Math.floor((i - t) / 2) : 0)
                                }).trigger("changesize"), l.width && l.height || (t = [e.width, e.height], (n = d.file(l.hash)).width = t[0], n.height = t[1]), c.hideinfo()
                            }, s.onerror = t, s.postMessage({
                                scripts: [d.options.cdns.tiff, d.getWorkerUrl("quicklook.tiff.js")],
                                data: {
                                    data: e
                                }
                            })
                        } catch (e) {
                            t(e)
                        }
                    } else t()
                }), p.one("change", function () {
                    n && n.state && "pending" === n.state() && n.reject()
                }))
            })
        }, function (s) {
            function l(e, o, t) {
                try {
                    d.replaceXhrSend(), c.fromURL(e).then(function (e) {
                        var a;
                        o.attr("src", e.image.toBase64()), requestAnimationFrame(function () {
                            a = (o.width() / o.height()).toFixed(2), u.on("changesize", function () {
                                var e, t, n = parseInt(u.width()),
                                    i = parseInt(u.height());
                                a < (n / i).toFixed(2) ? (t = i, e = Math.floor(t * a)) : (e = n, t = Math.floor(e / a)), o.width(e).height(t).css("margin-top", t < i ? Math.floor((i - t) / 2) : 0)
                            }).trigger("changesize"), t.remove(), s.hideinfo(), o.fadeIn(100)
                        })
                    }, function () {
                        t.remove(), o.remove()
                    }), d.restoreXhrSend()
                } catch (e) {
                    d.restoreXhrSend(), t.remove(), o.remove()
                }
            }
            var c, d = s.fm,
                p = d.arrayFlip(["image/vnd.adobe.photoshop", "image/x-photoshop"]),
                u = s.preview;
            u.on(s.evUpdate, function (e) {
                var t, n, i, a, o, r = e.file;
                p[r.mime] && d.options.cdns.psd && !d.UA.ltIE10 && s.dispInlineRegex.test(r.mime) && (e.stopImmediatePropagation(), n = st('<div class="elfinder-quicklook-info-data"><span class="elfinder-spinner-text">' + d.i18n("nowLoading") + '</span><span class="elfinder-spinner"></span></div>').appendTo(s.info.find(".elfinder-quicklook-info")), e = st('<div class="elfinder-quicklook-info-progress"></div>').appendTo(n), o = d.openUrl(r.hash, "sameorigin", function (e) {
                    e && (t = st("<img/>").hide().appendTo(u), c ? l(e, t, n) : (i = window.define, a = window.require, window.require = null, window.define = null, d.loadScript([d.options.cdns.psd], function () {
                        c = require("psd"), i ? window.define = i : delete window.define, a ? window.require = a : delete window.require, l(e, t, n)
                    })))
                }, {
                    progressBar: e
                }), u.one("change", function () {
                    o && o.state && "pending" === o.state() && o.reject()
                }))
            })
        }, function (a) {
            var o = a.fm,
                r = o.arrayFlip(["text/html", "application/xhtml+xml"]),
                s = a.preview;
            s.on(a.evUpdate, function (e) {
                var t, n, i = e.file;
                r[i.mime] && a.dispInlineRegex.test(i.mime) && (!a.options.getSizeMax || i.size <= a.options.getSizeMax) && (e.stopImmediatePropagation(), n = st('<div class="elfinder-quicklook-info-data"><span class="elfinder-spinner-text">' + o.i18n("nowLoading") + '</span><span class="elfinder-spinner"></span></div>').appendTo(a.info.find(".elfinder-quicklook-info")), e = st('<div class="elfinder-quicklook-info-progress"></div>').appendTo(n), s.one("change", function () {
                    "pending" == t.state() && t.reject()
                }).addClass("elfinder-overflow-auto"), t = o.request({
                    data: {
                        cmd: "get",
                        target: i.hash,
                        conv: 1,
                        _t: i.ts
                    },
                    options: {
                        type: "get",
                        cache: !0
                    },
                    preventDefault: !0,
                    progressBar: e
                }).done(function (e) {
                    a.hideinfo();
                    var t = st('<iframe class="elfinder-quicklook-preview-html"></iframe>').appendTo(s)[0].contentWindow.document;
                    t.open(), t.write(e.content), t.close()
                }).always(function () {
                    n.remove()
                }))
            })
        }, function (a) {
            function o(e, t) {
                a.hideinfo();
                var n = st('<iframe class="elfinder-quicklook-preview-html"></iframe>').appendTo(c)[0].contentWindow.document;
                n.open(), n.write((d.parse || d)(e.content)), n.close(), t.remove()
            }

            function r(e) {
                d = !1, e.remove()
            }
            var s = a.fm,
                l = s.arrayFlip(["text/x-markdown"]),
                c = a.preview,
                d = null;
            c.on(a.evUpdate, function (e) {
                var t, n, i = e.file;
                l[i.mime] && s.options.cdns.marked && !1 !== d && a.dispInlineRegex.test(i.mime) && (!a.options.getSizeMax || i.size <= a.options.getSizeMax) && (e.stopImmediatePropagation(), n = st('<div class="elfinder-quicklook-info-data"><span class="elfinder-spinner-text">' + s.i18n("nowLoading") + '</span><span class="elfinder-spinner"></span></div>').appendTo(a.info.find(".elfinder-quicklook-info")), e = st('<div class="elfinder-quicklook-info-progress"></div>').appendTo(n), c.one("change", function () {
                    "pending" == t.state() && t.reject()
                }).addClass("elfinder-overflow-auto"), t = s.request({
                    data: {
                        cmd: "get",
                        target: i.hash,
                        conv: 1,
                        _t: i.ts
                    },
                    options: {
                        type: "get",
                        cache: !0
                    },
                    preventDefault: !0,
                    progressBar: e
                }).done(function (t) {
                    d || window.marked ? (d = d || window.marked, o(t, n)) : s.loadScript([s.options.cdns.marked], function (e) {
                        d = e || window.marked || !1, delete window.marked, d ? o(t, n) : r(n)
                    }, {
                        tryRequire: !0,
                        error: function () {
                            r(n)
                        }
                    })
                }).fail(function () {
                    r(n)
                }))
            })
        }, function (o) {
            var r, s, l, c, d, e, p;
            o.options.viewerjs && (r = o.fm, s = o.preview, l = o.options.viewerjs, c = l.url ? r.arrayFlip(l.mimes || []) : [], d = o.window, e = o.navbar, p = function () {
                e.css("bottom", d.hasClass("elfinder-quicklook-fullscreen") ? "30px" : "")
            }, l.url && s.on("update", function (e) {
                var t, n, i, a = e.file;
                !c[a.mime] || "application/pdf" === a.mime && l.pdfNative && o.flags.pdfNative || (e.stopImmediatePropagation(), n = st('<div class="elfinder-quicklook-info-data"><span class="elfinder-spinner-text">' + r.i18n("nowLoading") + '</span><span class="elfinder-spinner"></span></div>').appendTo(o.info.find(".elfinder-quicklook-info")), e = st('<div class="elfinder-quicklook-info-progress"></div>').appendTo(n), i = r.openUrl(a.hash, "sameorigin", function (e) {
                    e && (t = st('<iframe class="elfinder-quicklook-preview-iframe"></iframe>').css("background-color", "transparent").on("load", function () {
                        o.hideinfo(), n.remove(), t.css("background-color", "#fff")
                    }).on("error", function () {
                        n.remove(), t.remove()
                    }).appendTo(s).attr("src", l.url + "#" + e), d.on("viewchange.viewerjs", p), p(), s.one("change", function () {
                        d.off("viewchange.viewerjs"), n.remove(), t.off("load").remove()
                    }))
                }, {
                    progressBar: e
                }), s.one("change", function () {
                    i && i.state && "pending" === i.state() && i.reject()
                }))
            }))
        }, function (i) {
            var a = i.fm,
                o = "application/pdf",
                r = i.preview,
                s = !1,
                l = "";
            a.UA.Safari && "mac" === a.OS && !a.UA.iOS || a.UA.IE || a.UA.Firefox ? s = !0 : st.each(navigator.plugins, function (e, t) {
                st.each(t, function (e, t) {
                    if (t.type === o) return !(s = !0)
                })
            }), (i.flags.pdfNative = s) && (void 0 === i.options.pdfToolbar || i.options.pdfToolbar || (l = "#toolbar=0"), r.on(i.evUpdate, function (e) {
                var t, n = e.file;
                s && n.mime === o && i.dispInlineRegex.test(n.mime) && (e.stopImmediatePropagation(), t = a.openUrl(n.hash, !1, function (e) {
                    e && (i.hideinfo(), i.cover.addClass("elfinder-quicklook-coverbg"), st('<object class="elfinder-quicklook-preview-pdf" data="' + e + l + '" type="application/pdf" ></object>').on("error", function (e) {
                        s = !1, i.update(void 0, a.cwd()), i.update(void 0, n)
                    }).appendTo(r))
                }), r.one("change", function () {
                    t && t.state && "pending" === t.state() && t.reject()
                }))
            }))
        }, function (i) {
            var a = i.fm,
                o = "application/x-shockwave-flash",
                r = i.preview,
                n = !1;
            st.each(navigator.plugins, function (e, t) {
                st.each(t, function (e, t) {
                    if (t.type === o) return !(n = !0)
                })
            }), n && r.on(i.evUpdate, function (e) {
                var t, n = e.file;
                n.mime === o && i.dispInlineRegex.test(n.mime) && (e.stopImmediatePropagation(), t = a.openUrl(n.hash, !1, function (e) {
                    e && (i.hideinfo(), st('<embed class="elfinder-quicklook-preview-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" src="' + e + '" quality="high" type="application/x-shockwave-flash" wmode="transparent" />').appendTo(r))
                }), r.one("change", function () {
                    t && t.state && "pending" === t.state() && t.reject()
                }))
            })
        }, function (c) {
            function d() {
                e.css("bottom", k.hasClass("elfinder-quicklook-fullscreen") ? "50px" : "")
            }

            function p(e, t) {
                return st('<audio class="elfinder-quicklook-preview-audio ui-front" controls' + n + ' preload="auto" autobuffer><source src="' + e + '" ></source></audio>').on("change", function (e) {
                    e.stopPropagation()
                }).on("error", function (e) {
                    h && h.data("hash") === t && i()
                }).data("hash", t).appendTo(w)
            }

            function u(t) {
                var e, n = h.data("hash");
                (e = g ? t.play() : e) && e.catch && e.catch(function (e) {
                    t.paused || h && h.data("hash") === n && i()
                })
            }

            function i() {
                if (h && h.parent().length) {
                    var e = h[0],
                        t = h.children("source").attr("src");
                    k.off("viewchange.audio");
                    try {
                        e.pause(), h.empty(), t.match(/^blob:/) && URL.revokeObjectURL(t), e.src = "", e.load()
                    } catch (e) { }
                    h.remove(), h = null
                }
            }
            var h, f, m, g, v, b, y = c.fm,
                w = c.preview,
                x = {
                    "audio/mpeg": "mp3",
                    "audio/mpeg3": "mp3",
                    "audio/mp3": "mp3",
                    "audio/x-mpeg3": "mp3",
                    "audio/x-mp3": "mp3",
                    "audio/x-wav": "wav",
                    "audio/wav": "wav",
                    "audio/x-m4a": "m4a",
                    "audio/aac": "m4a",
                    "audio/mp4": "m4a",
                    "audio/x-mp4": "m4a",
                    "audio/ogg": "ogg",
                    "audio/webm": "webm",
                    "audio/flac": "flac",
                    "audio/x-flac": "flac",
                    "audio/amr": "amr"
                },
                k = c.window,
                e = c.navbar,
                n = "string" == typeof c.options.mediaControlsList && c.options.mediaControlsList ? ' controlsList="' + y.escape(c.options.mediaControlsList) + '"' : "";
            w.on(c.evUpdate, function (e) {
                var t, n, i, a, o, r, s = e.file,
                    l = x[s.mime];
                x[s.mime] && c.dispInlineRegex.test(s.mime) && ((t = c.support.audio[l]) || "amr" === l) && (g = c.autoPlay(), f = s.hash, t ? (e.stopImmediatePropagation(), v = st('<div class="elfinder-quicklook-info-data"><span class="elfinder-spinner-text">' + y.i18n("nowLoading") + '</span><span class="elfinder-spinner"></span></div>').appendTo(c.info.find(".elfinder-quicklook-info")), b = st('<div class="elfinder-quicklook-info-progress"></div>').appendTo(v), n = y.openUrl(f, !1, function (e) {
                    v.remove(), e ? (h = p(e, f), u(h[0]), k.on("viewchange.audio", d), d()) : h.remove()
                }, {
                    progressBar: b
                }), w.one("change", function () {
                    n && n.state && "pending" === n.state() && n.reject()
                })) : y.options.cdns.amr && "amr" === l && !1 !== m && (e.stopImmediatePropagation(), v = st('<div class="elfinder-quicklook-info-data"><span class="elfinder-spinner-text">' + y.i18n("nowLoading") + '</span><span class="elfinder-spinner"></span></div>').appendTo(c.info.find(".elfinder-quicklook-info")), b = st('<div class="elfinder-quicklook-info-progress"></div>').appendTo(v), h = p("", f), i = s.hash, o = st.Deferred(), r = st.Deferred().done(function () {
                    var e = y.getContents(i, "arraybuffer", {
                        progressBar: b
                    }).done(function (e) {
                        try {
                            var t = m.toWAV(new Uint8Array(e));
                            t ? o.resolve(URL.createObjectURL(new Blob([t], {
                                type: "audio/x-wav"
                            }))) : o.reject()
                        } catch (e) {
                            o.reject()
                        }
                    }).fail(function () {
                        o.reject()
                    });
                    w.one("change", function () {
                        e && e.state && "pending" === e.state() && e.reject()
                    })
                }).fail(function () {
                    m = !1, o.reject()
                }), window.TextEncoder && window.URL && URL.createObjectURL && void 0 === m ? (a = window.AMR, delete window.AMR, y.loadScript([y.options.cdns.amr], function () {
                    m = window.AMR || !1, window.AMR = a, r[m ? "resolve" : "reject"]()
                }, {
                    error: function () {
                        r.reject()
                    }
                })) : r[m ? "resolve" : "reject"](), o.done(function (t) {
                    if (v.remove(), f === s.hash) {
                        var e = h[0];
                        try {
                            h.children("source").attr("src", t), e.pause(), e.load(), u(e), k.on("viewchange.audio", d), d()
                        } catch (e) {
                            URL.revokeObjectURL(t), h.remove()
                        }
                    } else URL.revokeObjectURL(t)
                }).fail(function () {
                    h.remove()
                })))
            }).one("change", i)
        }, function (r) {
            function s() {
                T.UA.iOS ? S.hasClass("elfinder-quicklook-fullscreen") ? (A.css("height", "-webkit-calc(100% - 50px)"), e._show()) : A.css("height", "") : e.css("bottom", S.hasClass("elfinder-quicklook-fullscreen") ? "50px" : "")
            }

            function l(e, t) {
                function n(e) {
                    1 < a && (k && clearTimeout(k), k = setTimeout(function () {
                        i || f(!0)
                    }, 800))
                }
                var i, a = 0,
                    o = "";
                b = null, (t = t || {}).cssClass && (o = " " + t.cssClass), r.hideinfo(), (m = st('<video class="elfinder-quicklook-preview-video' + o + '" controls' + O + ' preload="auto" autobuffer playsinline></video>').on("change", function (e) {
                    e.stopPropagation()
                }).on("timeupdate progress", n).on("canplay", function () {
                    i = !0
                }).data("hash", e.hash))[0].addEventListener("error", function (e) {
                    t.src && T.convAbsUrl(t.src) === T.convAbsUrl(e.target.src) && (++a, n())
                }, !0), t.src && m.append('<source src="' + t.src + '" type="' + e.mime + '"></source><source src="' + t.src + '"></source>'), m.appendTo(A), S.on("viewchange.video", s), s()
            }

            function c(t) {
                var n, e = T.openUrl(t.hash, !1, function (e) {
                    C.remove(), e && (l(t), (n = new g).loadSource(e), n.attachMedia(m[0]), x && n.on(g.Events.MANIFEST_PARSED, function () {
                        h(m[0])
                    }))
                }, {
                    progressBar: z
                });
                A.one("change", function () {
                    e && e.state && "pending" === e.state() && e.reject()
                })
            }

            function d(n) {
                var e = T.openUrl(n.hash, !1, function (e) {
                    var t;
                    C.remove(), e && (l(n), (t = (b = window.dashjs.MediaPlayer().create()).getDebug()).setLogLevel ? t.setLogLevel(dashjs.Debug.LOG_LEVEL_FATAL) : t.setLogToBrowserConsole && t.setLogToBrowserConsole(!1), b.initialize(m[0], e, x), b.on("error", function (e) {
                        f(!0)
                    }))
                }, {
                    progressBar: z
                });
                A.one("change", function () {
                    e && e.state && "pending" === e.state() && e.reject()
                })
            }

            function p(n) {
                var e;
                y.isSupported() ? (e = T.openUrl(n.hash, !1, function (e) {
                    var t;
                    C.remove(), e && (t = y.createPlayer({
                        type: "flv",
                        url: e
                    }), l(n), t.on(y.Events.ERROR, function () {
                        t.destroy(), f(!0)
                    }), t.attachMediaElement(m[0]), t.load(), h(t))
                }, {
                    progressBar: z
                }), A.one("change", function () {
                    e && e.state && "pending" === e.state() && e.reject()
                })) : y = !1
            }

            function u(t) {
                var e = T.openUrl(t.hash, !1, function (e) {
                    C.remove(), e && (l(t, {
                        src: e,
                        cssClass: "video-js"
                    }), m[0].src = e, w(m[0], {
                        autoplay: !0
                    }))
                }, {
                    progressBar: z
                });
                A.one("change", function () {
                    e && e.state && "pending" === e.state() && e.reject()
                })
            }

            function h(t) {
                var e, n = m.data("hash");
                (e = x ? t.play() : e) && e.catch && e.catch(function (e) {
                    t.paused || m && m.data("hash") === n && f(!0)
                })
            }

            function f(e) {
                if (k && clearTimeout(k), m && m.parent().length) {
                    var t = m[0];
                    S.off("viewchange.video"), b && b.reset();
                    try {
                        t.pause(), m.empty(), t.src = "", t.load()
                    } catch (e) { }
                    m.remove(), m = null
                }
                e && r.info.show()
            }
            var m, g, v, b, y, w, x, k, C, z, T = r.fm,
                A = r.preview,
                j = {
                    "video/mp4": "mp4",
                    "video/x-m4v": "mp4",
                    "video/quicktime": "mp4",
                    "video/mpeg": "mpeg",
                    "video/ogg": "ogg",
                    "application/ogg": "ogg",
                    "video/webm": "webm",
                    "video/x-matroska": "mkv",
                    "video/3gpp": "3gp",
                    "application/vnd.apple.mpegurl": "m3u8",
                    "application/x-mpegurl": "m3u8",
                    "application/dash+xml": "mpd",
                    "video/x-flv": "flv",
                    "video/x-msvideo": "avi"
                },
                S = r.window,
                e = r.navbar,
                O = "string" == typeof r.options.mediaControlsList && r.options.mediaControlsList ? ' controlsList="' + T.escape(r.options.mediaControlsList) + '"' : "";
            A.on(r.evUpdate, function (e) {
                var t, n, i = e.file,
                    a = i.mime.toLowerCase(),
                    o = j[a];
                j[a] && r.dispInlineRegex.test(i.mime) && (x = r.autoPlay(), C = st('<div class="elfinder-quicklook-info-data"><span class="elfinder-spinner-text">' + T.i18n("nowLoading") + '</span><span class="elfinder-spinner"></span></div>'), z = st('<div class="elfinder-quicklook-info-progress"></div>').appendTo(C), r.support.video[o] && ("m3u8" !== o || T.UA.Safari) ? (e.stopImmediatePropagation(), C.appendTo(r.info.find(".elfinder-quicklook-info")), n = T.openUrl(i.hash, !1, function (e) {
                    C.remove(), e && (l(i, {
                        src: e
                    }), h(m[0]))
                }, {
                    progressBar: z
                }), A.one("change", function () {
                    n && n.state && "pending" === n.state() && n.reject()
                })) : !1 !== g && T.options.cdns.hls && "m3u8" === o ? (e.stopImmediatePropagation(), C.appendTo(r.info.find(".elfinder-quicklook-info")), g ? c(i) : (t = window.Hls, delete window.Hls, T.loadScript([T.options.cdns.hls], function (e) {
                    g = e || window.Hls || !1, window.Hls = t, g && c(i)
                }, {
                    tryRequire: !0,
                    error: function () {
                        g = !1
                    }
                }))) : !1 !== v && T.options.cdns.dash && "mpd" === o ? (e.stopImmediatePropagation(), C.appendTo(r.info.find(".elfinder-quicklook-info")), v ? d(i) : T.loadScript([T.options.cdns.dash], function () {
                    (v = !!window.dashjs) && d(i)
                }, {
                    tryRequire: !0,
                    error: function () {
                        v = !1
                    }
                })) : !1 !== y && T.options.cdns.flv && "flv" === o ? (e.stopImmediatePropagation(), C.appendTo(r.info.find(".elfinder-quicklook-info")), y ? p(i) : (t = window.flvjs, delete window.flvjs, T.loadScript([T.options.cdns.flv], function (e) {
                    y = e || window.flvjs || !1, window.flvjs = t, y && p(i)
                }, {
                    tryRequire: !0,
                    error: function () {
                        y = !1
                    }
                }))) : T.options.cdns.videojs && (e.stopImmediatePropagation(), C.appendTo(r.info.find(".elfinder-quicklook-info")), w ? u(i) : T.loadScript([T.options.cdns.videojs + "/video.min.js"], function (e) {
                    (w = e || window.videojs || !1) && u(i)
                }, {
                    tryRequire: !0,
                    error: function () {
                        w = !1
                    }
                }).loadCss([T.options.cdns.videojs + "/video-js.min.css"])))
            }).one("change", f)
        }, function (s) {
            var l, c = s.preview,
                d = [],
                p = s.window,
                u = s.navbar;
            st.each(navigator.plugins, function (e, t) {
                st.each(t, function (e, t) {
                    0 !== t.type.indexOf("audio/") && 0 !== t.type.indexOf("video/") || d.push(t.type)
                })
            }), d = s.fm.arrayFlip(d), c.on(s.evUpdate, function (e) {
                function t() {
                    u.css("bottom", p.hasClass("elfinder-quicklook-fullscreen") ? "50px" : "")
                }
                var n, i, a, o = e.file,
                    r = o.mime;
                d[o.mime] && s.dispInlineRegex.test(o.mime) && (e.stopImmediatePropagation(), a = st('<div class="elfinder-quicklook-info-data"><span class="elfinder-spinner-text">' + fm.i18n("nowLoading") + '</span><span class="elfinder-spinner"></span></div>').appendTo(s.info.find(".elfinder-quicklook-info")), e = st('<div class="elfinder-quicklook-info-progress"></div>').appendTo(a), i = s.fm.openUrl(o.hash, !1, function (e) {
                    a.remove(), e && ((n = 0 === r.indexOf("video/")) && s.hideinfo(), l = st('<embed src="' + e + '" type="' + r + '" class="elfinder-quicklook-preview-' + (n ? "video" : "audio") + '"/>').appendTo(c), p.on("viewchange.embed", t), t())
                }, {
                    progressBar: e
                }), c.one("change", function () {
                    i && i.state && "pending" === i.state() && i.reject()
                }))
            }).one("change", function () {
                l && l.parent().length && (p.off("viewchange.embed"), l.remove(), l = null)
            })
        }, function (l) {
            var c = l.fm,
                d = c.arrayFlip(["application/zip", "application/x-gzip", "application/x-tar", "application/x-bzip2"]),
                p = l.preview,
                u = c.returnBytes(l.options.unzipMaxSize || 0),
                h = !(!c.options.cdns.zlibUnzip || !c.options.cdns.zlibGunzip),
                f = !!c.options.cdns.bzip2;
            window.Worker && window.Uint8Array && window.DataView && p.on(l.evUpdate, function (e) {
                var t, i, a, o = e.file,
                    n = "application/x-tar" === o.mime,
                    r = "application/x-bzip2" === o.mime,
                    s = "application/zip" === o.mime || "application/x-gzip" === o.mime;
                d[o.mime] && (!u || o.size <= u) && (n || r && f || s && h) && (e.stopImmediatePropagation(), a = st('<div class="elfinder-quicklook-info-data"><span class="elfinder-spinner-text">' + c.i18n("nowLoading") + '</span><span class="elfinder-spinner"></span></div>').appendTo(l.info.find(".elfinder-quicklook-info")), n = st('<div class="elfinder-quicklook-info-progress"></div>').appendTo(a), p.one("change", function () {
                    "pending" === t.state() && t.reject(), i && i.terminate(), a.remove()
                }), t = c.getContents(o.hash, "arraybuffer", {
                    progressBar: n
                }).fail(function () {
                    a.remove()
                }).done(function (e) {
                    function t(e) {
                        i && i.terminate(), a.remove(), s ? h = !1 : r && (f = !1), c.debug("error", e)
                    }
                    try {
                        (i = c.getWorker()).onmessage = function (e) {
                            if (i && i.terminate(), a.remove(), !e.data || e.data.error) new Error(e.data && e.data.error ? e.data.error : "");
                            else {
                                var t, e = e.data.files,
                                    n = 0;
                                if (e && e.length) {
                                    e = st.map(e, function (e) {
                                        return c.decodeRawString(e)
                                    });
                                    e.sort();
                                    e = c.escape(e.join("\n").replace(/\{formatSize\((\d+)\)\}/g, function (e, t) {
                                        n += parseInt(t);
                                        return c.formatSize(t)
                                    }));
                                    t = "<strong>" + c.escape(o.mime) + "</strong> (" + c.formatSize(o.size) + " / " + c.formatSize(n) + ")" + "<hr/>";
                                    st('<div class="elfinder-quicklook-preview-archive-wrapper">' + t + '<pre class="elfinder-quicklook-preview-text">' + e + "</pre></div>").on("touchstart", function (e) {
                                        if (st(this)["scroll" + (c.direction === "ltr" ? "Right" : "Left")]() > 5) e.originalEvent._preventSwipeX = true
                                    }).appendTo(p);
                                    l.hideinfo()
                                }
                                a.remove()
                            }
                        }, i.onerror = t, "application/x-tar" === o.mime ? i.postMessage({
                            scripts: [c.getWorkerUrl("quicklook.unzip.js")],
                            data: {
                                type: "tar",
                                bin: e
                            }
                        }) : "application/zip" === o.mime ? i.postMessage({
                            scripts: [c.options.cdns.zlibUnzip, c.getWorkerUrl("quicklook.unzip.js")],
                            data: {
                                type: "zip",
                                bin: e
                            }
                        }) : "application/x-gzip" === o.mime ? i.postMessage({
                            scripts: [c.options.cdns.zlibGunzip, c.getWorkerUrl("quicklook.unzip.js")],
                            data: {
                                type: "gzip",
                                bin: e
                            }
                        }) : "application/x-bzip2" === o.mime && i.postMessage({
                            scripts: [c.options.cdns.bzip2, c.getWorkerUrl("quicklook.unzip.js")],
                            data: {
                                type: "bzip2",
                                bin: e
                            }
                        })
                    } catch (e) {
                        t(e)
                    }
                }))
            })
        }, function (c) {
            var d, p = c.fm,
                u = p.arrayFlip(["application/x-rar"]),
                h = c.preview;
            window.DataView && h.on(c.evUpdate, function (e) {
                var n, i, a, o, r, s, t, l = e.file;
                u[l.mime] && p.options.cdns.rar && !1 !== d && (o = function (e) {
                    if (a) n.remove();
                    else try {
                        i = d({
                            file: e,
                            type: 2,
                            xhrHeaders: p.customHeaders,
                            xhrFields: p.xhrFields
                        }, function (e) {
                            n.remove();
                            var t = [];
                            a || e ? e && p.debug("error", e) : (st.each(i.entries, function () {
                                t.push(this.path + (this.size ? " (" + p.formatSize(this.size) + ")" : ""))
                            }), t.length && ((t = st.map(t, function (e) {
                                return p.decodeRawString(e)
                            })).sort(), e = "<strong>" + p.escape(l.mime) + "</strong> (" + p.formatSize(l.size) + ")<hr/>", st('<div class="elfinder-quicklook-preview-archive-wrapper">' + e + '<pre class="elfinder-quicklook-preview-text">' + p.escape(t.join("\n")) + "</pre></div>").on("touchstart", function (e) {
                                5 < st(this)["scroll" + ("ltr" === p.direction ? "Right" : "Left")]() && (e.originalEvent._preventSwipeX = !0)
                            }).appendTo(h), c.hideinfo()))
                        })
                    } catch (e) {
                        n.remove()
                    }
                }, r = function () {
                    d = !1, n.remove()
                }, e.stopImmediatePropagation(), n = st('<div class="elfinder-quicklook-info-data"><span class="elfinder-spinner-text">' + p.i18n("nowLoading") + '</span><span class="elfinder-spinner"></span></div>').appendTo(c.info.find(".elfinder-quicklook-info")), e = st('<div class="elfinder-quicklook-info-progress"></div>').appendTo(n), h.one("change", function () {
                    i && (i.abort = !0), n.remove(), a = !0
                }), t = p.openUrl(l.hash, "sameorigin", function (t) {
                    t && (d ? o(t) : (window.RarArchive && (s = window.RarArchive, delete window.RarArchive), p.loadScript([p.options.cdns.rar], function () {
                        p.hasRequire ? require(["rar"], function (e) {
                            d = e, o(t)
                        }, r) : (d = window.RarArchive) ? (s ? window.RarArchive = s : delete window.RarArchive, o(t)) : r()
                    }, {
                        tryRequire: !0,
                        error: r
                    })))
                }, {
                    progressBar: e,
                    temporary: !0
                }), h.one("change", function () {
                    t && t.state && "pending" === t.state() && t.reject()
                }))
            })
        }, function (a) {
            var o, r = a.fm,
                s = r.arrayFlip(a.options.sharecadMimes || []),
                l = a.preview;
            a.window;
            a.options.sharecadMimes.length && a.addIntegration({
                title: "ShareCAD.org CAD and 3D-Models viewer",
                link: "https://sharecad.org/DWGOnlinePlugin"
            }), l.on(a.evUpdate, function (e) {
                var t, n, i = e.file;
                s[i.mime.toLowerCase()] && r.option("onetimeUrl", i.hash) && (a.window, e.stopImmediatePropagation(), "1" == i.url && (l.hide(), st('<div class="elfinder-quicklook-info-data"><button class="elfinder-info-button">' + r.i18n("getLink") + "</button></div>").appendTo(a.info.find(".elfinder-quicklook-info")).on("click", function () {
                    var e = st(this);
                    e.html('<span class="elfinder-spinner">'), r.request({
                        data: {
                            cmd: "url",
                            target: i.hash
                        },
                        preventDefault: !0,
                        progressBar: n
                    }).always(function () {
                        e.html("")
                    }).done(function (e) {
                        var t = r.file(i.hash);
                        i.url = t.url = e.url || "", i.url && l.trigger({
                            type: a.evUpdate,
                            file: i,
                            forceUpdate: !0
                        })
                    })
                })), "" !== i.url && "1" != i.url && (l.one("change", function () {
                    t.remove(), o.off("load").remove(), o = null
                }).addClass("elfinder-overflow-auto"), t = st('<div class="elfinder-quicklook-info-data"><span class="elfinder-spinner-text">' + r.i18n("nowLoading") + '</span><span class="elfinder-spinner"></span></div>').appendTo(a.info.find(".elfinder-quicklook-info")), n = st('<div class="elfinder-quicklook-info-progress"></div>').appendTo(t), e = r.convAbsUrl(r.url(i.hash)), o = st('<iframe class="elfinder-quicklook-preview-iframe" scrolling="no"></iframe>').css("background-color", "transparent").appendTo(l).on("load", function () {
                    a.hideinfo(), t.remove(), a.preview.after(a.info), st(this).css("background-color", "#fff").show()
                }).on("error", function () {
                    t.remove(), a.preview.after(a.info)
                }).attr("src", "//sharecad.org/cadframe/load?url=" + encodeURIComponent(e)), a.info.after(a.preview)))
            })
        }, function (r) {
            var s, l, e, a, c, d = r.fm,
                p = {
                    "application/vnd.google-earth.kml+xml": !0,
                    "application/vnd.google-earth.kmz": !0
                },
                u = r.preview;
            r.options.googleMapsApiKey && (r.addIntegration({
                title: "Google Maps",
                link: "https://www.google.com/intl/" + d.lang.replace("_", "-") + "/help/terms_maps.html"
            }), s = window.google && google.maps, l = function (e, t, n) {
                var i = r.options.googleMapsOpts.maps;
                d.forExternalUrl(e.hash, {
                    progressBar: n
                }).done(function (e) {
                    if (e) try {
                        new s.KmlLayer(e, Object.assign({
                            map: new s.Map(t.get(0), i)
                        }, r.options.googleMapsOpts.kml)), r.hideinfo()
                    } catch (e) {
                        a()
                    } else a()
                })
            }, e = window.gm_authFailure, a = function () {
                c = null
            }, c = "https://maps.googleapis.com/maps/api/js?key=" + r.options.googleMapsApiKey, window.gm_authFailure = function () {
                a(), e && e()
            }, u.on(r.evUpdate, function (e) {
                var t, n, i, a, o = e.file;
                c && p[o.mime.toLowerCase()] && (r.window, t = "1" == o.url && !d.option("onetimeUrl", o.hash), e.stopImmediatePropagation(), n = st('<div class="elfinder-quicklook-info-data"><span class="elfinder-spinner-text">' + d.i18n("nowLoading") + '</span><span class="elfinder-spinner"></span></div>').appendTo(r.info.find(".elfinder-quicklook-info")), i = st('<div class="elfinder-quicklook-info-progress"></div>').appendTo(n), t && (u.hide(), st('<div class="elfinder-quicklook-info-data"><button class="elfinder-info-button">' + d.i18n("getLink") + "</button></div>").appendTo(r.info.find(".elfinder-quicklook-info")).on("click", function () {
                    var e = st(this);
                    e.html('<span class="elfinder-spinner">'), d.request({
                        data: {
                            cmd: "url",
                            target: o.hash
                        },
                        preventDefault: !0,
                        progressBar: i
                    }).always(function () {
                        n.remove(), e.html("")
                    }).done(function (e) {
                        var t = d.file(o.hash);
                        o.url = t.url = e.url || "", o.url && u.trigger({
                            type: r.evUpdate,
                            file: o,
                            forceUpdate: !0
                        })
                    })
                })), "" === o.url || t || (a = st('<div style="width:100%;height:100%;"></div>').appendTo(u), u.one("change", function () {
                    a.remove(), a = null
                }), s ? l(o, a, i) : d.loadScript([c], function () {
                    (s = window.google && google.maps) && l(o, a, i)
                })))
            }))
        }, function (d) {
            var p, e, u = d.fm,
                h = Object.assign(u.arrayFlip(d.options.googleDocsMimes || [], "g"), u.arrayFlip(d.options.officeOnlineMimes || [], "m")),
                f = d.preview,
                m = (d.window, d.navbar),
                g = {
                    g: "docs.google.com/gview?embedded=true&url=",
                    m: "view.officeapps.live.com/op/embed.aspx?wdStartOn=0&src="
                },
                v = {
                    g: "56px",
                    m: "24px"
                },
                b = {
                    xls: 5242880,
                    xlsb: 5242880,
                    xlsx: 5242880,
                    xlsm: 5242880,
                    other: 10485760
                };
            d.options.googleDocsMimes.length && (e = !0, d.addIntegration({
                title: "Google Docs Viewer",
                link: "https://docs.google.com/"
            })), d.options.officeOnlineMimes.length && (e = !0, d.addIntegration({
                title: "MS Online Doc Viewer",
                link: "https://products.office.com/office-online/view-office-documents-online"
            })), e && f.on(d.evUpdate, function (e) {
                var n, t, i, a, o, r, s, l, c = e.file;
                c.size <= 26214400 && (n = h[c.mime]) && (i = d.window, a = function () {
                    m.css("bottom", i.hasClass("elfinder-quicklook-fullscreen") ? v[n] : "")
                }, s = u.mimeTypes[c.mime], o = "1" == c.url && !u.option("onetimeUrl", c.hash), "m" === n && (b[s] && c.size > b[s] || c.size > b.other) && (n = "g"), o && (f.hide(), st('<div class="elfinder-quicklook-info-data"><button class="elfinder-info-button">' + u.i18n("getLink") + "</button></div>").appendTo(d.info.find(".elfinder-quicklook-info")).on("click", function () {
                    var e = st(this);
                    e.html('<span class="elfinder-spinner">'), u.request({
                        data: {
                            cmd: "url",
                            target: c.hash
                        },
                        preventDefault: !0
                    }).always(function () {
                        e.html("")
                    }).done(function (e) {
                        var t = u.file(c.hash);
                        c.url = t.url = e.url || "", c.url && f.trigger({
                            type: d.evUpdate,
                            file: c,
                            forceUpdate: !0
                        })
                    })
                })), "" === c.url || o || (e.stopImmediatePropagation(), f.one("change", function () {
                    t && t.status && "pending" === t.status() && t.reject(), i.off("viewchange.googledocs"), r.remove(), p.off("load").remove(), p = null
                }).addClass("elfinder-overflow-auto"), r = st('<div class="elfinder-quicklook-info-data"><span class="elfinder-spinner-text">' + u.i18n("nowLoading") + '</span><span class="elfinder-spinner"></span></div>').appendTo(d.info.find(".elfinder-quicklook-info")), s = st('<div class="elfinder-quicklook-info-progress"></div>').appendTo(r), p = st('<iframe class="elfinder-quicklook-preview-iframe"></iframe>').css("background-color", "transparent").appendTo(f), t = u.forExternalUrl(c.hash, {
                    progressBar: s
                }).done(function (e) {
                    function t() {
                        try {
                            !p || p.attr("src") && !p.get(0).contentWindow.document || (p.attr("src", "https://" + g[n] + encodeURIComponent(e)), l = setTimeout(t, 2e3))
                        } catch (e) { }
                    }
                    e ? (c.ts && (e += (e.match(/\?/) ? "&" : "?") + "_t=" + c.ts), p.on("load", function () {
                        l && clearTimeout(l), d.hideinfo(), r.remove(), d.preview.after(d.info), st(this).css("background-color", "#fff").show()
                    }).on("error", function () {
                        l && clearTimeout(l), r.remove(), d.preview.after(d.info)
                    }), t()) : (r.remove(), p.remove())
                }), i.on("viewchange.googledocs", a), a(), d.info.after(d.preview)))
            })
        }, function (s) {
            "use strict";
            var n, i, l = s.fm,
                c = s.preview,
                d = parseInt(s.options.textInitialLines) || 150,
                p = parseInt(s.options.prettifyMaxLines) || 500,
                a = function () {
                    o = function () {
                        return !1
                    }, i && (window.PR = i), n = !1
                },
                o = function (t) {
                    l.options.cdns.prettify ? (o = function (e) {
                        return setTimeout(function () {
                            u(e)
                        }, 100), "pending"
                    }, window.PR && (i = window.PR), l.loadScript([l.options.cdns.prettify + (l.options.cdns.prettify.match(/\?/) ? "&" : "?") + "autorun=false"], function (e) {
                        "object" == typeof (n = e || window.PR) ? (o = function () {
                            return !0
                        }, i ? window.PR = i : delete window.PR, r(t)) : a()
                    }, {
                        tryRequire: !0,
                        error: a
                    })) : a()
                },
                r = function (e) {
                    e && !e.hasClass("prettyprinted") && (e.css("cursor", "wait"), requestAnimationFrame(function () {
                        n.prettyPrint && n.prettyPrint(null, e.get(0)), e.css("cursor", "")
                    }))
                },
                u = function (e) {
                    !0 === o(e) && r(e)
                };
            c.on(s.evUpdate, function (e) {
                var t, a, o, r = e.file;
                r.mime;
                l.mimeIsText(r.mime) && (!s.options.getSizeMax || r.size <= s.options.getSizeMax) && !1 !== n && (e.stopImmediatePropagation(), a = st('<div class="elfinder-quicklook-info-data"><span class="elfinder-spinner-text">' + l.i18n("nowLoading") + '</span><span class="elfinder-spinner"></span></div>').appendTo(s.info.find(".elfinder-quicklook-info")), e = st('<div class="elfinder-quicklook-info-progress"></div>').appendTo(a), c.one("change", function () {
                    "pending" == t.state() && t.reject(), o && o.remove()
                }), t = l.request({
                    data: {
                        cmd: "get",
                        target: r.hash,
                        conv: r.encoding || 1,
                        _t: r.ts
                    },
                    options: {
                        type: "get",
                        cache: !0
                    },
                    preventDefault: !0,
                    progressBar: e
                }).done(function (e) {
                    var t, n, i, a = new RegExp("^(data:" + r.mime.replace(/([.+])/g, "\\$1") + ";base64,)", "i"),
                        o = e.content;
                    "string" == typeof o && (s.hideinfo(), window.atob && (a = o.match(a)) && (o = atob(o.substr(a[1].length))), 10 < (a = (i = o.match(/([^\r\n]{1,100}[\r\n]*)/g)).length - d) ? t = i.splice(0, d).join("") : a = 0, n = st('<div class="elfinder-quicklook-preview-text-wrapper"><pre class="elfinder-quicklook-preview-text prettyprint"></pre></div>'), a && n.append(st('<div class="elfinder-quicklook-preview-charsleft"><hr/><span>' + l.i18n("linesLeft", l.toLocaleString(a)) + "</span></div>").on("click", function () {
                        var e = n.scrollTop();
                        st(this).remove(), n.children("pre").removeClass("prettyprinted").text(o).scrollTop(e), i.length <= p && u(n)
                    })), n.children("pre").text(t || o), n.on("touchstart", function (e) {
                        5 < st(this)["scroll" + ("ltr" === l.direction ? "Right" : "Left")]() && (e.originalEvent._preventSwipeX = !0)
                    }).appendTo(c), e.toasts && Array.isArray(e.toasts) && st.each(e.toasts, function () {
                        this.msg && l.toast(this)
                    }), u(n))
                }).always(function (e) {
                    var t, n, i;
                    (t = l.getCommand("edit")) && (i = [], e && e.encoding && i.push({
                        value: e.encoding
                    }), i.push({
                        value: "UTF-8"
                    }), (n = t.getEncSelect(i)).on("change", function () {
                        r.encoding = n.val(), l.cache(r, "change"), c.trigger({
                            type: s.evUpdate,
                            file: r,
                            forceUpdate: !0
                        })
                    }), o = st('<div class="elfinder-quicklook-encoding"></div>').append(n), s.window.append(o)), a.remove()
                }))
            })
        }], (Fe.prototype.commands.reload = function () {
            "use strict";
            var e = this,
                i = !1;
            this.alwaysEnabled = !0, this.updateOnSelect = !0, this.shortcuts = [{
                pattern: "ctrl+shift+r f5"
            }], this.getstate = function () {
                return 0
            }, this.init = function () {
                this.fm.bind("search searchend", function () {
                    i = "search" == this.type
                })
            }, this.fm.bind("contextmenu", function () {
                var t = e.fm;
                1e3 <= t.options.sync && (e.extra = {
                    icon: "accept",
                    node: st("<span></span>").attr({
                        title: t.i18n("autoSync")
                    }).on("click touchstart", function (e) {
                        "touchstart" === e.type && 1 < e.originalEvent.touches.length || (e.stopPropagation(), e.preventDefault(), st(this).parent().toggleClass("ui-state-disabled", t.options.syncStart).parent().removeClass("ui-state-hover"), t.options.syncStart = !t.options.syncStart, t.autoSync(t.options.syncStart ? null : "stop"))
                    }).on("ready", function () {
                        st(this).parent().toggleClass("ui-state-disabled", !t.options.syncStart).css("pointer-events", "auto")
                    })
                })
            }), this.exec = function () {
                var e, t, n = this.fm;
                if (!i) return e = n.sync(), t = setTimeout(function () {
                    n.notify({
                        type: "reload",
                        cnt: 1,
                        hideCnt: !0
                    }), e.always(function () {
                        n.notify({
                            type: "reload",
                            cnt: -1
                        })
                    })
                }, n.notifyDelay), e.always(function () {
                    clearTimeout(t), n.trigger("reload")
                });
                st("div.elfinder-toolbar > div." + n.res("class", "searchbtn") + " > span.ui-icon-search").click()
            }
        }).prototype = {
            forceLoad: !0
        }, Fe.prototype.commands.rename = function () {
            "use strict";
            this.alwaysEnabled = !0, this.syncTitleOnChange = !0;

            function k(n, e, i, a) {
                var t, o = e ? [i.hash].concat(e) : [i.hash],
                    r = o.length,
                    s = {};
                if (z.lockfiles({
                    files: o
                }), z.isRoot(i) && !i.netkey) {
                    if ((t = z.storage("rootNames")) || (t = {}), "" === a) {
                        if (!t[i.hash]) return n && n.reject(), z.unlockfiles({
                            files: o
                        }).trigger("selectfiles", {
                            files: o
                        });
                        i.name = i._name, i.i18 = i._i18, delete t[i.hash], delete i._name, delete i._i18
                    } else void 0 === i._name && (i._name = i.name, i._i18 = i.i18), i.name = t[i.hash] = a, delete i.i18;
                    return z.storage("rootNames", t), z.updateCache(s = {
                        changed: [i]
                    }), z.change(s), n && n.resolve(s), z.unlockfiles({
                        files: o
                    }).trigger("selectfiles", {
                        files: o
                    })
                }
                s = {
                    cmd: "rename",
                    name: a,
                    target: i.hash
                }, 1 < r && (s.targets = e, a.match(/\*/) && (s.q = a)), z.request({
                    data: s,
                    notify: {
                        type: "rename",
                        cnt: r
                    },
                    navigate: {}
                }).fail(function (e) {
                    e = z.parseError(e);
                    n && n.reject(), e && Array.isArray(e) && "errRename" === e[0] || z.sync()
                }).done(function (e) {
                    var t;
                    e.added && e.added.length && 1 === r && (e.undo = {
                        cmd: "rename",
                        callback: function () {
                            return z.request({
                                data: {
                                    cmd: "rename",
                                    target: e.added[0].hash,
                                    name: i.name
                                },
                                notify: {
                                    type: "undo",
                                    cnt: 1
                                }
                            })
                        }
                    }, e.redo = {
                        cmd: "rename",
                        callback: function () {
                            return z.request({
                                data: {
                                    cmd: "rename",
                                    target: i.hash,
                                    name: a
                                },
                                notify: {
                                    type: "rename",
                                    cnt: 1
                                }
                            })
                        }
                    }), n && n.resolve(e), (t = z.cwd().hash) && t !== i.hash || z.exec("open", st.map(e.added, function (e) {
                        return "directory" === e.mime ? e.hash : null
                    })[0])
                }).always(function () {
                    z.unlockfiles({
                        files: o
                    }).trigger("selectfiles", {
                        files: o
                    })
                })
            }

            function C(e, t) {
                var n, i, t = t || z.selected(),
                    e = z.splitFileExtention(e),
                    a = z.file(t[0]),
                    o = z.file(t[1]),
                    r = e[1] ? "." + e[1] : "";
                return e[1] && "*" === e[0] ? (n = '"' + z.splitFileExtention(a.name)[0] + r + '", ', n += '"' + z.splitFileExtention(o.name)[0] + r + '"') : 1 < e[0].length && ("*" === e[0].substr(-1) ? (n = '"' + (i = e[0].substr(0, e[0].length - 1)) + a.name + '", ', n += '"' + i + o.name + '"') : "*" === e[0].substr(0, 1) && (i = e[0].substr(1), n = '"' + z.splitFileExtention(a.name)[0] + i + r + '", ', n += '"' + z.splitFileExtention(o.name)[0] + i + r + '"')), n = n || '"' + e[0] + "1" + r + '", "' + e[0] + "2" + r + '"', 2 < t.length && (n += " ..."), n
            }

            function l() {
                function e(e, t) {
                    return st('<label class="elfinder-rename-batch-checks">' + z.i18n(t) + "</label>").prepend(e)
                }

                function i() {
                    var e = n.val(),
                        t = z.splitFileExtention(z.file(o[0]).name)[1];
                    return "" === e && !r.is(":checked") || (s.is(":checked") ? e += "*" : l.is(":checked") ? e = "*" + e + "." + t : c.is(":checked") ? e = "*." + e : t && (e += "." + t)), e
                }
                var a, o = z.selected(),
                    t = '<input name="type" type="radio" class="elfinder-tabstop">',
                    n = st('<input type="text" class="ui-corner-all elfinder-tabstop">'),
                    r = st(t),
                    s = st(t),
                    l = st(t),
                    c = st(t),
                    t = st("<div></div>").append(e(r, "plusNumber"), e(s, "asPrefix"), e(l, "asSuffix"), e(c, "changeExtention")),
                    d = st('<div class="elfinder-rename-batch-preview"></div>'),
                    p = st('<div class="elfinder-rename-batch"></div>').append(st('<div class="elfinder-rename-batch-name"></div>').append(n), st('<div class="elfinder-rename-batch-type"></div>').append(t), d),
                    u = {
                        title: z.i18n("batchRename"),
                        modal: !0,
                        destroyOnClose: !0,
                        width: Math.min(380, z.getUI().width() - 20),
                        buttons: {},
                        open: function () {
                            n.on("input", h).trigger("focus")
                        }
                    },
                    h = function () {
                        var e = i();
                        "" !== e ? d.html(z.i18n(["renameMultiple", o.length, C(e)])) : d.empty()
                    },
                    f = t.find("input:radio").on("change", h);
                u.buttons[z.i18n("btnApply")] = function () {
                    var e, t, n = i();
                    "" !== n && (a.elfinderdialog("close"), t = o, e = z.file(t.shift()), k(void 0, t, e, n))
                }, u.buttons[z.i18n("btnCancel")] = function () {
                    a.elfinderdialog("close")
                }, st.fn.checkboxradio ? f.checkboxradio({
                    create: function (e, t) {
                        this === r.get(0) && r.prop("checked", !0).change()
                    }
                }) : t.buttonset({
                    create: function (e, t) {
                        r.prop("checked", !0).change()
                    }
                }), a = m.fmDialog(p, u)
            }
            var m = this,
                z = m.fm;
            this.noChangeDirOnRemovedCwd = !0, this.shortcuts = [{
                pattern: "f2" + ("mac" == z.OS ? " enter" : "")
            }, {
                pattern: "shift+f2",
                description: "batchRename",
                callback: function () {
                    1 < z.selected().length && l()
                }
            }], this.getstate = function (e) {
                var t, n, i, a, o, r, e = this.files(e),
                    s = e.length;
                return s ? (1 < s && e[0].phash && (t = e[0].phash, n = z.splitFileExtention(e[0].name)[1].toLowerCase(), i = e[0].mime), 1 === s && (r = z.isRoot(e[0])), o = 1 === s && (z.cookieEnabled && r || !e[0].locked) || 2.103 < z.api && s === st.grep(e, function (e) {
                    return !(a || e.locked || e.phash !== t || z.isRoot(e) || i !== e.mime && n !== z.splitFileExtention(e.name)[1].toLowerCase()) || (a = a && !0, !1)
                }).length ? 0 : -1, -1 !== (o = !r && 0 === o && z.option("disabledFlip", e[0].hash).rename ? -1 : o) && 1 < s ? m.extra = {
                    icon: "preference",
                    node: st("<span></span>").attr({
                        title: z.i18n("batchRename")
                    }).on("click touchstart", function (e) {
                        "touchstart" === e.type && 1 < e.originalEvent.touches.length || (e.stopPropagation(), e.preventDefault(), z.getUI().trigger("click"), l())
                    })
                } : delete m.extra, o) : -1
            }, this.exec = function (e, t) {
                z.getUI("cwd");
                var n, a = e || !!z.selected().length && z.selected() || [z.cwd().hash],
                    o = a.length,
                    r = z.file(a.shift()),
                    i = ".elfinder-cwd-filename",
                    e = t || {},
                    t = z.cwd().hash == r.hash,
                    s = "files" !== ("navbar" === e._currentType || "files" === e._currentType ? e._currentType : t ? "navbar" : "files"),
                    l = z[s ? "navHash2Elm" : "cwdHash2Elm"](r.hash),
                    c = !s && "list" != z.storage("view"),
                    d = function () {
                        requestAnimationFrame(function () {
                            f && f.trigger("blur")
                        })
                    },
                    p = function () {
                        b.is(":hidden") || b.elfinderoverlay("hide").off("click close", y), v.removeClass("ui-front").css("position", "").off("unselect." + z.namespace, d), c ? g && g.css("max-height", "") : s || v.css("width", "").parent("td").css("overflow", "")
                    },
                    u = st.Deferred().fail(function (e) {
                        var t = f.parent(),
                            n = z.escape(r.i18 || r.name);
                        f.off(), c && (n = n.replace(/([_.])/g, "&#8203;$1")), requestAnimationFrame(function () {
                            s ? f.replaceWith(n) : t.length ? (f.remove(), t.html(n)) : l.find(i).html(n)
                        }), e && z.error(e)
                    }).always(function () {
                        p(), z.unbind("resize", w), z.enable()
                    }),
                    h = function (e) {
                        function t() {
                            f.off(), p(), s ? f.replaceWith(z.escape(n)) : g.html(z.escape(n)), k(u, a, r, n)
                        }
                        var n = st.trim(f.val()),
                            i = (z.splitFileExtention(n), !0);
                        if (b.is(":hidden") || v.css("z-index", ""), "" === n) {
                            if (!z.isRoot(r)) return y();
                            s ? f.replaceWith(z.escape(r.name)) : g.html(z.escape(r.name))
                        }
                        if (!x && v.length) {
                            if (f.off("blur"), 1 === o && n === r.name) return u.reject();
                            if (z.options.validName && z.options.validName.test) try {
                                i = z.options.validName.test(n)
                            } catch (e) {
                                i = !1
                            }
                            return "." !== n && ".." !== n && i ? 1 === o && z.fileByName(n, r.phash) ? (x = !0, z.error(["errExists", n], {
                                modal: !0,
                                close: function () {
                                    setTimeout(m, 120)
                                }
                            }), !1) : void (1 === o ? t() : (z.confirm({
                                title: "cmdrename",
                                text: ["renameMultiple", o, C(n, [r.hash].concat(a))],
                                accept: {
                                    label: "btnYes",
                                    callback: t
                                },
                                cancel: {
                                    label: "btnCancel",
                                    callback: function () {
                                        setTimeout(function () {
                                            x = !0, m()
                                        }, 120)
                                    }
                                }
                            }), setTimeout(function () {
                                z.trigger("unselectfiles", {
                                    files: z.selected()
                                }).trigger("selectfiles", {
                                    files: [r.hash].concat(a)
                                })
                            }, 120))) : (x = !0, z.error("directory" === r.mime ? "errInvDirname" : "errInvName", {
                                modal: !0,
                                close: function () {
                                    setTimeout(m, 120)
                                }
                            }), !1)
                        }
                    },
                    f = st(c ? "<textarea></textarea>" : '<input type="text"/>').on("keyup text", function () {
                        c ? (this.style.height = "1px", this.style.height = this.scrollHeight + "px") : n && (this.style.width = n + "px", this.scrollWidth > n && (this.style.width = this.scrollWidth + 10 + "px"))
                    }).on("keydown", function (e) {
                        e.stopImmediatePropagation(), e.keyCode == st.ui.keyCode.ESCAPE ? u.reject() : e.keyCode == st.ui.keyCode.ENTER && (e.preventDefault(), f.trigger("blur"))
                    }).on("mousedown click dblclick", function (e) {
                        e.stopPropagation(), "dblclick" === e.type && e.preventDefault()
                    }).on("blur", h).on("dragenter dragleave dragover drop", function (e) {
                        e.stopPropagation()
                    }),
                    m = function () {
                        var e = z.splitFileExtention(f.val())[0];
                        x || !z.UA.Mobile || z.UA.iOS || (b.on("click close", y).elfinderoverlay("show"), v.css("z-index", b.css("z-index") + 1)), z.enabled() || z.enable(), x && (x = !1, f.on("blur", h)), f.trigger("focus").trigger("select"), f[0].setSelectionRange && f[0].setSelectionRange(0, e.length)
                    },
                    g = s ? l.contents().filter(function () {
                        return 3 == this.nodeType && st(this).parent().attr("id") === z.navHash2Id(r.hash)
                    }) : l.find(i),
                    v = g.parent(),
                    b = z.getUI("overlay"),
                    y = function (e) {
                        b.is(":hidden") || v.css("z-index", ""), x || (u.reject(), e && (e.stopPropagation(), e.preventDefault()))
                    },
                    w = function () {
                        l.trigger("scrolltoview", {
                            blink: !1
                        })
                    },
                    x = !1;
                return v.addClass("ui-front").css("position", "relative").on("unselect." + z.namespace, d), z.bind("resize", w), s ? g.replaceWith(f.val(r.name)) : (c ? g.css("max-height", "none") : s || (n = v.width(), v.width(n - 15).parent("td").css("overflow", "visible")), g.empty().append(f.val(r.name))), 1 < o && z.api <= 2.103 ? u.reject() : r && g.length ? r.locked && !z.isRoot(r) ? u.reject(["errLocked", r.name]) : (z.one("select", function () {
                    f.parent().length && r && -1 === st.inArray(r.hash, z.selected()) && f.trigger("blur")
                }), f.trigger("keyup"), m(), u) : u.reject("errCmdParams", this.title)
            }, z.bind("select contextmenucreate closecontextmenu", function (e) {
                var t = (e.data ? e.data.selected || e.data.targets : null) || z.selected();
                t && 1 === t.length && (t = z.file(t[0])) && z.isRoot(t) ? m.title = z.i18n("kindAlias") + " (" + z.i18n("preference") + ")" : m.title = z.i18n("cmdrename"), "closecontextmenu" !== e.type ? m.update(void 0, m.title) : requestAnimationFrame(function () {
                    m.update(void 0, m.title)
                })
            }).remove(function (e) {
                var n;
                e.data && e.data.removed && (n = z.storage("rootNames")) && (st.each(e.data.removed, function (e, t) {
                    n[t] && delete n[t]
                }), z.storage("rootNames", n))
            })
        }, Fe.prototype.commands.resize = function () {
            "use strict";
            var ot = this.fm,
                rt = 0;
            this.updateOnSelect = !1, this.getstate = function () {
                var e = ot.selectedFiles();
                return 1 == e.length && e[0].read && e[0].write && -1 !== e[0].mime.indexOf("image/") ? 0 : -1
            }, this.resizeRequest = function (e, t, n) {
                var t = t || ot.file(e.target);
                t && t.tmb;
                return ot.isCommandEnabled("resize", e.target) && (!t || t.read && t.write && -1 !== t.mime.indexOf("image/")) ? ot.request({
                    data: Object.assign(e, {
                        cmd: "resize"
                    }),
                    notify: {
                        type: "resize",
                        cnt: 1
                    }
                }).fail(function (e) {
                    n && n.reject(e)
                }).done(function () {
                    e.quality && ot.storage("jpgQuality", e.quality === ot.option("jpgQuality") ? null : e.quality), n && n.resolve()
                }) : (t = t ? -1 === t.mime.indexOf("image/") ? ["errResize", t.name, "errUsupportType"] : ["errResize", t.name, "errPerm"] : ["errResize", e.target, "errPerm"], n ? n.reject(t) : ot.error(t), st.Deferred().reject(t))
            }, this.exec = function (e) {
                function t(o, P, q) {
                    function R() {
                        te = !0
                    }

                    function H() {
                        te && (te = !1, f.trigger("change"))
                    }

                    function _(e) {
                        var t, n, i, a;
                        try {
                            t = pe[Math.round(e.offsetX)][Math.round(e.offsetY)]
                        } catch (e) { }
                        t && (n = t[0], i = t[1], a = t[2], t[3], t[4], t[5], L(n, i, a, "click" === e.type))
                    }

                    function N(e) {
                        L(st(this).css("backgroundColor"), "", "", "click" === e.type)
                    }

                    function L(e, t, n, i) {
                        var a;
                        "string" == typeof e && (t = "", e && (a = st("<span>").css("backgroundColor", e).css("backgroundColor")) && (a = a.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)) && (e = Number(a[1]), t = Number(a[2]), n = Number(a[3]))), a = "" === t ? e : "#" + ue(e, t, n), O.val(a).css({
                            backgroundColor: a,
                            backgroundImage: "none",
                            color: e + t + n < 384 ? "#fff" : "#000"
                        }), d.css("backgroundColor", a), i && (E.off(".picker").removeClass("elfinder-resize-picking"), I.off(".picker").removeClass("elfinder-resize-picking"))
                    }

                    function W() {
                        S.updateView(M, k), Ce(), je.width(A.width()).height(A.height()), Se.width(A.width()).height(A.height()), D.updateView(), Ne()
                    }

                    function B(e) {
                        var t = ot.file(o.hash);
                        t.width = e[0], t.height = e[1]
                    }

                    function $() {
                        var e, t;
                        if (!Ae) {
                            Ae = !0, Te && Te.state && "pending" === Te.state() && Te.reject(), 2.103 <= ot.api ? 0 === rt && ot.request({
                                data: {
                                    cmd: "resize",
                                    target: o.hash,
                                    degree: 0,
                                    mode: "rotate"
                                },
                                preventDefault: !0
                            }).done(function (e) {
                                1 === (rt = e.losslessRotate ? 1 : -1) && x.val() % 90 == 0 && ae.children("div.elfinder-resize-quality").hide()
                            }).fail(function () {
                                rt = -1
                            }) : rt = -1, t = A.get(0), (e = o.width && o.height ? {
                                w: o.width,
                                h: o.height
                            } : t.naturalWidth ? null : {
                                w: A.width(),
                                h: A.height()
                            }) && A.removeAttr("width").removeAttr("height"), M = o.width || t.naturalWidth || t.width || A.width(), k = o.height || t.naturalHeight || t.height || A.height(), o.width && o.height || B([M, k]), e && A.width(e.w).height(e.h), G.show(), (t = k / M) < 1 && d.height() > d.width() * t && d.height(d.width() * t), d.height() > A.height() + 20 && d.height(A.height() + 20), z = d.height() - (p.outerHeight() - p.height()), ne.remove(), fe = M / k, p.append(A.show()).show(), m.val(M), g.val(k);
                            try {
                                X = document.createElement("canvas"), J = X.getContext("2d")
                            } catch (e) {
                                he.hide(), I.hide()
                            }
                            We.on("click", "span.elfinder-resize-preset", function () {
                                var e = st(this),
                                    t = e.data("s")[0],
                                    n = e.data("s")[1],
                                    i = M / k;
                                e.data("s", [n, t]).text(n + "x" + t), t < M || n < k ? !(M <= t) && (k <= n || k - n < M - t) ? n = j(t / i) : t = j(n * i) : (t = M, n = k), m.val(t), g.val(n), S.updateView(t, n), Ne()
                            }), Be.on("click", "span.elfinder-resize-preset", function () {
                                var e = st(this),
                                    t = e.data("s")[0],
                                    n = e.data("s")[1],
                                    i = v.val(),
                                    a = b.val();
                                e.data("s", [n, t]).text(n + "x" + t), t <= M && n <= k && (M - t - i < 0 && (i = M - t), k - n - a < 0 && (a = k - n), v.val(i), b.val(a), y.val(t), w.val(n), D.updateView(), Ne())
                            }), Be.children("span.elfinder-resize-preset").each(function () {
                                var e = st(this),
                                    t = e.data("s")[0],
                                    n = e.data("s")[1];
                                e[t <= M && n <= k ? "show" : "hide"]()
                            }), W(), ce[et]("enable"), f.find("input,select").prop("disabled", !1).filter(":text").on("keydown", function (e) {
                                e.keyCode == st.ui.keyCode.ENTER && (e.stopPropagation(), e.preventDefault(), e = {
                                    title: st("input:checked", ce).val(),
                                    text: "confirmReq",
                                    accept: {
                                        label: "btnApply",
                                        callback: function () {
                                            Fe()
                                        }
                                    },
                                    cancel: {
                                        label: "btnCancel",
                                        callback: function () {
                                            st(this).trigger("focus")
                                        }
                                    }
                                }, $e && (e.buttons = [{
                                    label: "btnSaveAs",
                                    callback: function () {
                                        requestAnimationFrame(Ue)
                                    }
                                }]), ot.confirm(e))
                            }).on("keyup", function () {
                                var e = st(this);
                                e.hasClass("elfinder-resize-bg") || requestAnimationFrame(function () {
                                    e.val(e.val().replace(/[^0-9]/g, ""))
                                })
                            }).filter(":first"), ke(), ot.UA.Mobile || m.trigger("focus"), Me()
                        }
                    }

                    function V() {
                        var e, t, n, i, a, o, r = "";
                        if ("resize" == s) e = parseInt(m.val()) || 0, t = parseInt(g.val()) || 0;
                        else if ("crop" == s) e = parseInt(y.val()) || 0, t = parseInt(w.val()) || 0, n = parseInt(v.val()) || 0, i = parseInt(b.val()) || 0;
                        else if ("rotate" == s) {
                            if (e = M, t = k, (a = parseInt(x.val()) || 0) < 0 || 360 < a) return ot.error("Invalid rotate degree"), !1;
                            if (0 == a || 360 == a) return ot.error("errResizeNoChange"), !1;
                            r = O.val()
                        }
                        if (o = u ? parseInt(u.val()) : 0, "rotate" != s) {
                            if (e <= 0 || t <= 0) return ot.error("Invalid image size"), !1;
                            if (e == M && t == k && parseInt(Ve / 1e3) === parseInt(Ke / 1e3)) return ot.error("errResizeNoChange"), !1
                        }
                        return {
                            w: e,
                            h: t,
                            x: n,
                            y: i,
                            d: a,
                            q: o,
                            b: r
                        }
                    }
                    var K, X, J, G, l, Y, Q, Z = "image/jpeg" === o.mime,
                        c = st('<div class="elfinder-resize-container"></div>'),
                        e = '<input type="number" class="ui-corner-all"/>',
                        t = '<div class="elfinder-resize-row"></div>',
                        n = '<div class="elfinder-resize-label"></div>',
                        ee = null,
                        te = !1,
                        f = st('<div class="elfinder-resize-control"></div>').on("focus", "input[type=text],input[type=number]", function () {
                            st(this).trigger("select")
                        }).on("change", function () {
                            ee && cancelAnimationFrame(ee), ee = requestAnimationFrame(function () {
                                var t, e, n, i, a, o, r, s, l, c, d, p, u, h;
                                _e && !te && (e = _e.data("canvas")) && (r = f.children("div.elfinder-resize-control-panel:visible"), (t = r.find("input.elfinder-resize-quality")).is(":visible") && (n = _e.data("ctx"), i = _e.get(0), r.hasClass("elfinder-resize-uiresize") ? (a = e.width = m.val(), o = e.height = g.val(), n.drawImage(i, 0, 0, a, o)) : r.hasClass("elfinder-resize-uicrop") ? (r = v.val(), s = b.val(), a = y.val(), o = w.val(), e.width = a, e.height = o, n.drawImage(i, r, s, a, o, 0, 0, a, o)) : (r = x.val(), s = x.val() * Math.PI / 180, l = M, c = k, d = s, p = [], u = {
                                    x: Number.MAX_VALUE,
                                    y: Number.MAX_VALUE
                                }, h = {
                                    x: Number.MIN_VALUE,
                                    y: Number.MIN_VALUE
                                }, st.each([{
                                    x: l / 2,
                                    y: c / 2
                                }, {
                                    x: -l / 2,
                                    y: c / 2
                                }, {
                                    x: -l / 2,
                                    y: -c / 2
                                }, {
                                    x: l / 2,
                                    y: -c / 2
                                }], function (e, t) {
                                    p.push({
                                        x: t.x * Math.cos(d) - t.y * Math.sin(d),
                                        y: t.x * Math.sin(d) + t.y * Math.cos(d)
                                    })
                                }), st.each(p, function (e, t) {
                                    u.x = Math.min(u.x, t.x), u.y = Math.min(u.y, t.y), h.x = Math.max(h.x, t.x), h.y = Math.max(h.y, t.y)
                                }), l = {
                                    width: h.x - u.x,
                                    height: h.y - u.y
                                }, a = e.width = l.width, o = e.height = l.height, n.save(), r % 90 != 0 && (n.fillStyle = O.val() || "#FFF", n.fillRect(0, 0, a, o)), n.translate(a / 2, o / 2), n.rotate(s), n.drawImage(i, -i.width / 2, -i.height / 2, M, k), n.restore()), e.toBlob(function (e) {
                                    e && (Ke = e.size, t.next("span").text(" (" + ot.formatSize(e.size) + ")"))
                                }, "image/jpeg", Math.max(Math.min(t.val(), 100), 1) / 100)))
                            })
                        }).on("mouseup", "input", function (e) {
                            st(e.target).trigger("change")
                        }),
                        d = st('<div class="elfinder-resize-preview"></div>').on("touchmove", function (e) {
                            st(e.target).hasClass("touch-punch") && (e.stopPropagation(), e.preventDefault())
                        }),
                        ne = st('<div class="elfinder-resize-loading">' + ot.i18n("ntfloadimg") + "</div>"),
                        p = st('<div class="elfinder-resize-handle touch-punch"></div>'),
                        a = st('<div class="elfinder-resize-handle touch-punch"></div>'),
                        i = st('<div class="elfinder-resize-uiresize elfinder-resize-control-panel"></div>'),
                        ie = st('<div class="elfinder-resize-uicrop elfinder-resize-control-panel"></div>'),
                        ae = st('<div class="elfinder-resize-rotate elfinder-resize-control-panel"></div>'),
                        oe = st("<button></button>").attr("title", ot.i18n("rotate-cw")).append(st('<span class="elfinder-button-icon elfinder-button-icon-rotate-l"></span>')),
                        re = st("<button></button>").attr("title", ot.i18n("rotate-ccw")).append(st('<span class="elfinder-button-icon elfinder-button-icon-rotate-r"></span>')),
                        se = st("<span ></span>"),
                        le = st('<button class="elfinder-resize-reset">').text(ot.i18n("reset")).on("click", function () {
                            Ie()
                        }).button({
                            icons: {
                                primary: "ui-icon-arrowrefresh-1-n"
                            },
                            text: !1
                        }),
                        ce = st('<div class="elfinder-resize-type"></div>').append('<input type="radio" name="type" id="' + P + '-resize" value="resize" checked="checked" /><label for="' + P + '-resize">' + ot.i18n("resize") + "</label>", '<input class="api2" type="radio" name="type" id="' + P + '-crop" value="crop" /><label class="api2" for="' + P + '-crop">' + ot.i18n("crop") + "</label>", '<input class="api2" type="radio" name="type" id="' + P + '-rotate" value="rotate" /><label class="api2" for="' + P + '-rotate">' + ot.i18n("rotate") + "</label>"),
                        s = "resize",
                        m = (ce[et]()[et]("disable").find("input").on("change", function () {
                            s = st(this).val(), Ie(), Me(!0), Ee(!0), De(!0), "resize" == s ? (i.show(), ae.hide(), ie.hide(), Me(), Z && xe.insertAfter(i.find(".elfinder-resize-grid8"))) : "crop" == s ? (ae.hide(), i.hide(), ie.show(), Ee(), Z && xe.insertAfter(ie.find(".elfinder-resize-grid8"))) : "rotate" == s && (i.hide(), ie.hide(), ae.show(), De())
                        }), st(e).on("change", function () {
                            var e = j(parseInt(m.val())),
                                t = j(h ? e / fe : parseInt(g.val()));
                            0 < e && 0 < t && (S.updateView(e, t), m.val(e), g.val(t))
                        }).addClass("elfinder-focus")),
                        g = st(e).on("change", function () {
                            var e = j(parseInt(g.val())),
                                t = j(h ? e * fe : parseInt(m.val()));
                            0 < t && 0 < e && (S.updateView(t, e), m.val(t), g.val(e))
                        }),
                        v = st(e).on("change", function () {
                            D.updateView()
                        }),
                        b = st(e).on("change", function () {
                            D.updateView()
                        }),
                        y = st(e).on("change", function () {
                            D.updateView("w")
                        }),
                        w = st(e).on("change", function () {
                            D.updateView("h")
                        }),
                        u = Z && Ge ? st(e).val(0 < ot.storage("jpgQuality") ? ot.storage("jpgQuality") : ot.option("jpgQuality")).addClass("elfinder-resize-quality").attr("min", "1").attr("max", "100").attr("title", "1 - 100").on("blur", function () {
                            var e = Math.min(100, Math.max(1, parseInt(this.value)));
                            f.find("input.elfinder-resize-quality").val(e)
                        }) : null,
                        x = st('<input type="number" class="ui-corner-all" maxlength="3" value="0" />').on("change", function () {
                            F.update()
                        }),
                        de = st('<div class="elfinder-resize-rotate-slider touch-punch"></div>').slider({
                            min: 0,
                            max: 360,
                            value: x.val(),
                            animate: !0,
                            start: R,
                            stop: H,
                            change: function (e, t) {
                                t.value != de.slider("value") && F.update(t.value)
                            },
                            slide: function (e, t) {
                                F.update(t.value, !1)
                            }
                        }).find(".ui-slider-handle").addClass("elfinder-tabstop").off("keydown").on("keydown", function (e) {
                            e.keyCode != st.ui.keyCode.LEFT && e.keyCode != st.ui.keyCode.RIGHT || (e.stopPropagation(), e.preventDefault(), F.update(Number(x.val()) + (e.keyCode == st.ui.keyCode.RIGHT ? 1 : -1), !1))
                        }).end(),
                        pe = {},
                        ue = function (e, t, n) {
                            return st.map([e, t, n], function (e) {
                                return ("0" + parseInt(e).toString(16)).slice(-2)
                            }).join("")
                        },
                        he = st("<button>").text(ot.i18n("colorPicker")).on("click", function () {
                            E.on("mousemove.picker click.picker", _).addClass("elfinder-resize-picking"), I.on("mousemove.picker click.picker", "span", N).addClass("elfinder-resize-picking")
                        }).button({
                            icons: {
                                primary: "ui-icon-pin-s"
                            },
                            text: !1
                        }),
                        e = st("<button>").text(ot.i18n("reset")).on("click", function () {
                            L("", "", "", !0)
                        }).button({
                            icons: {
                                primary: "ui-icon-arrowrefresh-1-n"
                            },
                            text: !1
                        }),
                        O = st('<input class="ui-corner-all elfinder-resize-bg" type="text">').on("focus", function () {
                            st(this).attr("style", "")
                        }).on("blur", function () {
                            L(st(this).val())
                        }),
                        I = st('<div class="elfinder-resize-pallet">').on("click", "span", function () {
                            L(st(this).css("backgroundColor"))
                        }),
                        fe = 1,
                        r = 1,
                        M = 0,
                        k = 0,
                        h = !0,
                        C = !1,
                        me = 0,
                        z = 0,
                        ge = 0,
                        ve = 0,
                        be = 0,
                        T = Z && tt,
                        ye = st("<button>").html(ot.i18n("aspectRatio")).on("click", function () {
                            h = !h, ye.button("option", {
                                icons: {
                                    primary: h ? "ui-icon-locked" : "ui-icon-unlocked"
                                }
                            }), S.fixHeight(), p.resizable("option", "aspectRatio", h).data("uiResizable")._aspectRatio = h
                        }).button({
                            icons: {
                                primary: h ? "ui-icon-locked" : "ui-icon-unlocked"
                            },
                            text: !1
                        }),
                        we = st("<button>").html(ot.i18n("aspectRatio")).on("click", function () {
                            C = !C, we.button("option", {
                                icons: {
                                    primary: C ? "ui-icon-locked" : "ui-icon-unlocked"
                                }
                            }), a.resizable("option", "aspectRatio", C).data("uiResizable")._aspectRatio = C
                        }).button({
                            icons: {
                                primary: C ? "ui-icon-locked" : "ui-icon-unlocked"
                            },
                            text: !1
                        }),
                        xe = st("<button>").html(ot.i18n(T ? "enabled" : "disabled")).toggleClass("ui-state-active", T).on("click", function () {
                            T = !T, xe.html(ot.i18n(T ? "enabled" : "disabled")).toggleClass("ui-state-active", T), ke()
                        }).button(),
                        ke = function () {
                            var e = T ? 8 : 1;
                            st.each([m, g, y, w, v, b], function () {
                                this.attr("step", e)
                            }), T && (m.val(j(m.val())), g.val(j(g.val())), y.val(j(y.val())), w.val(j(w.val())), v.val(j(v.val())), b.val(j(b.val())), i.is(":visible") ? S.updateView(m.val(), g.val()) : ie.is(":visible") && D.updateView())
                        },
                        Ce = function () {
                            function e() {
                                O.parent().hide(), I.hide()
                            }
                            var t = Math.min(me, z) / Math.sqrt(Math.pow(M, 2) + Math.pow(k, 2));
                            ge = Math.ceil(M * t), ve = Math.ceil(k * t), E.width(ge).height(ve).css("margin-top", (z - ve) / 2 + "px").css("margin-left", (me - ge) / 2 + "px"), E.is(":visible") && O.is(":visible") && ("image/png" !== o.mime ? (d.css("backgroundColor", O.val()), K = st("<img>"), ot.isCORS && K.attr("crossorigin", "use-credentials"), K.on("load", function () {
                                X && X.width !== ge && ze()
                            }).on("error", e).attr("src", He)) : e())
                        },
                        ze = function () {
                            if (J) {
                                var e, t, n, i, a, o, r, s, l, c, d, p, u, h = {},
                                    f = [],
                                    m = function (e) {
                                        return 8 * Math.round(e / 8)
                                    };
                                e: try {
                                    t = X.width = E.width(), n = X.height = E.height(), d = t / M, J.scale(d, d), J.drawImage(K.get(0), 0, 0);
                                    for (var g = J.getImageData(0, 0, t, n).data, v = .1 * t, b = .9 * t, y = .1 * n, w = .9 * n, x = 0; x < n - 1; x++)
                                        for (var k = 0; k < t - 1; k++) {
                                            if (i = g[e = 4 * k + x * t * 4], a = g[1 + e], o = g[2 + e], 255 !== g[3 + e]) {
                                                O.parent().hide(), I.hide();
                                                break e
                                            }
                                            C = i, z = a, T = o, S = j = A = void 0, j = Math.max(Math.max(C, z), T), S = Math.min(Math.min(C, z), T), j === S ? A = 0 : C === j ? A = ((z - T) / (j - S) * 60 + 360) % 360 : z === j ? A = (T - C) / (j - S) * 60 + 120 : T === j && (A = (C - z) / (j - S) * 60 + 240), l = [A, (j - S) / j, (.3 * C + .59 * z + .11 * T) / 255, "hsl"], c = Math.round(l[0]), r = Math.round(100 * l[1]), s = Math.round(100 * l[2]), pe[k] || (pe[k] = {}), pe[k][x] = [i, a, o, c, r, s], (k < v || b < k) && (x < y || w < x) && (h[p = m(i) + "," + m(a) + "," + m(o)] ? ++h[p] : h[p] = 1)
                                        }
                                    I.children(":first").length || (u = 1, st.each(h, function (e, t) {
                                        f.push({
                                            c: e,
                                            v: t
                                        })
                                    }), st.each(f.sort(function (e, t) {
                                        return e.v > t.v ? -1 : 1
                                    }), function () {
                                        if (this.v < 2 || 10 < u) return !1;
                                        I.append(st('<span style="width:20px;height:20px;display:inline-block;background-color:rgb(' + this.c + ');">')), ++u
                                    }))
                                } catch (e) {
                                    he.hide(), I.hide()
                                }
                            }
                            var C, z, T, A, j, S
                        },
                        Te = null,
                        Ae = !1,
                        A = st("<img/>").on("load", $).on("error", function () {
                            ne.html(ot.i18n("ntfsmth")).css("background", "transparent")
                        }),
                        je = st("<div></div>"),
                        Se = st("<img/>"),
                        Oe = st("<div></div>"),
                        E = st('<img class="elfinder-resize-imgrotate" />'),
                        j = function (e, t) {
                            return e = T ? 8 * Math.round(e / 8) : Math.round(e), e = Math.max(0, e), e = t && t < e ? T ? 8 * Math.floor(t / 8) : t : e
                        },
                        Ie = function () {
                            m.val(M), g.val(k), S.updateView(M, k), v.val(0), b.val(0), y.val(M), w.val(k), D.updateView(), Ne()
                        },
                        S = {
                            update: function () {
                                m.val(j(A.width() / r)), g.val(j(A.height() / r)), Ne()
                            },
                            updateView: function (e, t) {
                                me < e || z < t ? t / z < e / me ? (r = me / e, A.width(me).height(j(t * r))) : (r = z / t, A.height(z).width(j(e * r))) : A.width(j(e)).height(j(t)), r = A.width() / e, se.text("1 : " + (1 / r).toFixed(2)), S.updateHandle()
                            },
                            updateHandle: function () {
                                p.width(A.width()).height(A.height())
                            },
                            fixHeight: function () {
                                var e, t;
                                h && (e = m.val(), t = j(e / fe), S.updateView(e, t), g.val(t))
                            }
                        },
                        D = {
                            update: function (e) {
                                v.val(j((a.data("x") || a.position().left) / r, M)), b.val(j((a.data("y") || a.position().top) / r, k)), "xy" !== e && (y.val(j((a.data("w") || a.width()) / r, M - v.val())), w.val(j((a.data("h") || a.height()) / r, k - b.val()))), Ne()
                            },
                            updateView: function (e) {
                                var t, n, i;
                                v.val(j(v.val(), M - (T ? 8 : 1))), b.val(j(b.val(), k - (T ? 8 : 1))), y.val(j(y.val(), M - v.val())), w.val(j(w.val(), k - b.val())), C && (t = Oe.width() / Oe.height(), "w" === e ? w.val(j(parseInt(y.val()) / t)) : "h" === e && y.val(j(parseInt(w.val()) * t))), t = Math.round(parseInt(v.val()) * r), n = Math.round(parseInt(b.val()) * r), e = "xy" !== e ? (i = Math.round(parseInt(y.val()) * r), Math.round(parseInt(w.val()) * r)) : (i = a.data("w"), a.data("h")), a.data({
                                    x: t,
                                    y: n,
                                    w: i,
                                    h: e
                                }).width(i).height(e).css({
                                    left: t,
                                    top: n
                                }), Oe.width(i).height(e)
                            },
                            resize_update: function (e, t) {
                                a.data({
                                    x: t.position.left,
                                    y: t.position.top,
                                    w: t.size.width,
                                    h: t.size.height
                                }), D.update(), D.updateView()
                            },
                            drag_update: function (e, t) {
                                a.data({
                                    x: t.position.left,
                                    y: t.position.top
                                }), D.update("xy")
                            }
                        },
                        F = {
                            mouseStartAngle: 0,
                            imageStartAngle: 0,
                            imageBeingRotated: !1,
                            setQuality: function () {
                                ae.children("div.elfinder-resize-quality")[0 < rt && x.val() % 90 == 0 ? "hide" : "show"]()
                            },
                            update: function (e, t) {
                                void 0 === e && (be = e = parseInt(x.val())), !(t = void 0 === t ? !0 : t) || ot.UA.Opera || ot.UA.ltIE8 ? E.rotate(e) : E.animate({
                                    rotate: e + (ot.UA.Chrome ? "" : "deg")
                                }), (e %= 360) < 0 && (e += 360), x.val(parseInt(e)), de.slider("value", x.val()), F.setQuality()
                            },
                            execute: function (e) {
                                var t, n, i;
                                if (F.imageBeingRotated) return i = F.getCenter(E), n = e.originalEvent.touches ? e.originalEvent.touches[0] : e, t = n.pageX - i[0], n = n.pageY - i[1], i = Math.atan2(n, t) - F.mouseStartAngle + F.imageStartAngle, i = Math.round(180 * parseFloat(i) / Math.PI), e.shiftKey && (i = 15 * Math.round((i + 6) / 15)), E.rotate(i), (i %= 360) < 0 && (i += 360), x.val(i), de.slider("value", x.val()), F.setQuality(), !1
                            },
                            start: function (e) {
                                var t, n;
                                if (!E.hasClass("elfinder-resize-picking")) return R(), F.imageBeingRotated = !0, t = F.getCenter(E), e = e.originalEvent.touches ? e.originalEvent.touches[0] : e, n = e.pageX - t[0], e = e.pageY - t[1], F.mouseStartAngle = Math.atan2(e, n), F.imageStartAngle = parseFloat(E.rotate()) * Math.PI / 180, st(document).on("mousemove", F.execute), E.on("touchmove", F.execute), !1
                            },
                            stop: function (e) {
                                if (F.imageBeingRotated) return st(document).off("mousemove", F.execute), E.off("touchmove", F.execute), requestAnimationFrame(function () {
                                    F.imageBeingRotated = !1
                                }), H(), !1
                            },
                            getCenter: function (e) {
                                var t = E.rotate(),
                                    n = (E.rotate(0), E.offset()),
                                    i = n.left + E.width() / 2,
                                    n = n.top + E.height() / 2;
                                return E.rotate(t), Array(i, n)
                            }
                        },
                        Me = function (e) {
                            e ? (p.filter(":ui-resizable").resizable("destroy"), p.hide()) : (p.show(), p.resizable({
                                alsoResize: A,
                                aspectRatio: h,
                                resize: S.update,
                                start: R,
                                stop: function (e) {
                                    S.fixHeight, S.updateView(m.val(), g.val()), H()
                                }
                            }), Le())
                        },
                        Ee = function (e) {
                            e ? (a.filter(":ui-resizable").resizable("destroy").filter(":ui-draggable").draggable("destroy"), je.hide()) : (je.show(), a.resizable({
                                containment: je,
                                aspectRatio: C,
                                resize: D.resize_update,
                                start: R,
                                stop: H,
                                handles: "all"
                            }).draggable({
                                handle: Oe,
                                containment: Se,
                                drag: D.drag_update,
                                start: R,
                                stop: function () {
                                    D.updateView("xy"), H()
                                }
                            }), Le(), D.update())
                        },
                        De = function (e) {
                            e ? E.hide() : (E.show(), Le())
                        },
                        Fe = function () {
                            var e;
                            (e = V()) && (c.elfinderdialog("close"), Xe.resizeRequest({
                                target: o.hash,
                                width: e.w,
                                height: e.h,
                                x: e.x,
                                y: e.y,
                                degree: e.d,
                                quality: e.q,
                                bg: e.b,
                                mode: s
                            }, o, Je))
                        },
                        Ue = function () {
                            function i() {
                                a.addClass(at).fadeIn(function () {
                                    l.addClass(it)
                                }), ot.disable()
                            }

                            function e() {
                                Xe.mime = o.mime, Xe.prefix = o.name.replace(/ \d+(\.[^.]+)?$/, "$1"), Xe.requestCmd = "mkfile", Xe.nextAction = {}, Xe.data = {
                                    target: o.phash
                                }, st.proxy(ot.res("mixin", "make"), Xe)().done(function (e) {
                                    var t, n;
                                    e.added && e.added.length ? (t = e.added[0].hash, n = ot.api < 2.1032 ? ot.url(o.hash, {
                                        async: !0,
                                        temporary: !0
                                    }) : null, st.when(n).done(function (e) {
                                        ot.request({
                                            options: {
                                                type: "post"
                                            },
                                            data: {
                                                cmd: "put",
                                                target: t,
                                                encoding: n ? "scheme" : "hash",
                                                content: n ? ot.convAbsUrl(e) : o.hash
                                            },
                                            notify: {
                                                type: "copy",
                                                cnt: 1
                                            },
                                            syncOnFail: !0
                                        }).fail(i).done(function (e) {
                                            e = ot.normalize(e), ot.updateCache(e), o = ot.file(t), e.changed && e.changed.length && ot.change(e), l.show().find(".elfinder-dialog-title").html(ot.escape(o.name)), Fe(), a.fadeIn()
                                        })
                                    }).fail(i)) : i()
                                }).fail(i).always(function () {
                                    delete Xe.mime, delete Xe.prefix, delete Xe.nextAction, delete Xe.data
                                }), ot.trigger("unselectfiles", {
                                    files: [o.hash]
                                })
                            }
                            var a, t = null;
                            V() && (a = Ze.children("." + Xe.dialogClass + ":visible").removeClass(at).fadeOut(), l.removeClass(it), ot.enable(), ot.searchStatus.state < 2 && o.phash !== ot.cwd().hash && (t = ot.exec("open", [o.phash], {
                                thash: o.phash
                            })), st.when([t]).done(function () {
                                t ? ot.one("cwdrender", e) : e()
                            }).fail(i))
                        },
                        Pe = {},
                        qe = "elfinder-resize-handle-hline",
                        Re = "elfinder-resize-handle-vline",
                        U = "elfinder-resize-handle-point",
                        He = q,
                        _e = u ? st("<img>").attr("crossorigin", ot.isCORS ? "use-credentials" : "").attr("src", He).on("load", function () {
                            try {
                                var e = document.createElement("canvas");
                                _e.data("canvas", e).data("ctx", e.getContext("2d")), Ne()
                            } catch (e) {
                                _e.removeData("canvas").removeData("ctx")
                            }
                        }) : null,
                        Ne = function () {
                            f.find("input.elfinder-resize-quality:visible").trigger("change")
                        },
                        Le = function (e) {
                            var t, n, i, a, o, r, s;
                            l.hasClass("elfinder-dialog-minimized") || l.is(":hidden") || (We.hide(), Be.hide(), t = (n = ot.options.dialogContained ? Ze : st(window)).height(), n = n.width(), i = "auto", a = !0, l.width(Math.min(Qe, n - 30)), d.attr("style", ""), M && k && (me = d.width() - (p.outerWidth() - p.width()), z = d.height() - (p.outerHeight() - p.height()), S.updateView(M, k)), r = c.find("div.elfinder-resize-control").width(), s = d.width(), (o = c.width() - 20) < s ? (d.width(o), a = !1) : o - s < r && (t < n ? d.width(o - r - 20) : (d.css({
                                float: "none",
                                marginLeft: "auto",
                                marginRight: "auto"
                            }), a = !1)), a && (i = r), me = d.width() - (p.outerWidth() - p.width()), Ze.hasClass("elfinder-fullscreen") ? l.height() > t && (d.height((t -= 2) - l.height() + d.height()), l.css("top", 0 - Ze.offset().top)) : (t -= 30, d.height() > t && d.height(t)), z = d.height() - (p.outerHeight() - p.height()), M && k && W(), A.height() && d.height() > A.height() + 20 && (d.height(A.height() + 20), z = d.height() - (p.outerHeight() - p.height()), Ce()), We.css("width", i).show(), Be.css("width", i).show(), Be.children("span.elfinder-resize-preset:visible").length || Be.hide(), c.elfinderdialog("posInit"))
                        },
                        We = (Q = st('<fieldset class="elfinder-resize-preset-container">').append(st("<legend>").html(ot.i18n("presets"))).css("box-sizing", "border-box").hide(), st.each(nt, function (e, t) {
                            2 === t.length && (Y = !0, Q.append(st('<span class="elfinder-resize-preset"></span>').data("s", t).text(t[0] + "x" + t[1]).button()))
                        }), Y ? Q : st()),
                        Be = We.clone(!0),
                        $e = ot.uploadMimeCheck(o.mime, o.phash);
                    Ve = Ke = o.size, i.append(st(t).append(st(n).text(ot.i18n("width")), m), st(t).append(st(n).text(ot.i18n("height")), g, st('<div class="elfinder-resize-whctrls">').append(ye, le)), u ? st(t).append(st(n).text(ot.i18n("quality")), u, st("<span></span>")) : st(), Z ? st(t).append(st(n).text(ot.i18n("8pxgrid")).addClass("elfinder-resize-grid8"), xe) : st(), st(t).append(st(n).text(ot.i18n("scale")), se), st(t).append(We)), Ge && (ie.append(st(t).append(st(n).text("X"), v), st(t).append(st(n).text("Y")).append(b), st(t).append(st(n).text(ot.i18n("width")), y), st(t).append(st(n).text(ot.i18n("height")), w, st('<div class="elfinder-resize-whctrls">').append(we, le.clone(!0))), u ? st(t).append(st(n).text(ot.i18n("quality")), u.clone(!0), st("<span></span>")) : st(), Z ? st(t).append(st(n).text(ot.i18n("8pxgrid")).addClass("elfinder-resize-grid8")) : st(), st(t).append(Be)), ae.append(st(t).addClass("elfinder-resize-degree").append(st(n).text(ot.i18n("rotate")), x, st("<span></span>").text(ot.i18n("degree")), st("<div></div>").append(oe, re)[et]()), st(t).css("height", "20px").append(de), u ? st(t)[rt < 1 ? "show" : "hide"]().addClass("elfinder-resize-quality").append(st(n).text(ot.i18n("quality")), u.clone(!0), st("<span></span>")) : st(), st(t).append(st(n).text(ot.i18n("bgcolor")), O, he, e), st(t).css("height", "20px").append(I)), oe.on("click", function () {
                        be -= 90, F.update(be)
                    }), re.on("click", function () {
                        be += 90, F.update(be)
                    })), c.append(ce).on("resize", function (e) {
                        e.stopPropagation()
                    }), Ge ? f.append(i, ie.hide(), ae.hide()) : f.append(i), p.append('<div class="' + qe + " " + qe + '-top"></div>', '<div class="' + qe + " " + qe + '-bottom"></div>', '<div class="' + Re + " " + Re + '-left"></div>', '<div class="' + Re + " " + Re + '-right"></div>', '<div class="' + U + " " + U + '-e"></div>', '<div class="' + U + " " + U + '-se"></div>', '<div class="' + U + " " + U + '-s"></div>'), d.append(ne).append(p.hide()).append(A.hide()), Ge && (a.css("position", "absolute").append('<div class="' + qe + " " + qe + '-top"></div>', '<div class="' + qe + " " + qe + '-bottom"></div>', '<div class="' + Re + " " + Re + '-left"></div>', '<div class="' + Re + " " + Re + '-right"></div>', '<div class="' + U + " " + U + '-n"></div>', '<div class="' + U + " " + U + '-e"></div>', '<div class="' + U + " " + U + '-s"></div>', '<div class="' + U + " " + U + '-w"></div>', '<div class="' + U + " " + U + '-ne"></div>', '<div class="' + U + " " + U + '-se"></div>', '<div class="' + U + " " + U + '-sw"></div>', '<div class="' + U + " " + U + '-nw"></div>'), d.append(je.css("position", "absolute").hide().append(Se, a.append(Oe))), d.append(E.hide())), d.css("overflow", "hidden"), c.append(d, f), Pe[ot.i18n("btnApply")] = Fe, $e && (Pe[ot.i18n("btnSaveAs")] = function () {
                        requestAnimationFrame(Ue)
                    }), Pe[ot.i18n("btnCancel")] = function () {
                        c.elfinderdialog("close")
                    }, c.find("input,button").addClass("elfinder-tabstop"), l = Xe.fmDialog(c, {
                        title: ot.escape(o.name),
                        width: Qe,
                        resizable: !1,
                        buttons: Pe,
                        open: function () {
                            function e(e) {
                                Te = ot.request({
                                    data: {
                                        cmd: "dim",
                                        target: o.hash,
                                        substitute: t ? 400 : ""
                                    },
                                    preventDefault: !0
                                }).done(function (e) {
                                    var t;
                                    if (!e.url && n) c.elfinderdialog("close"), ot.error(["errOpen", o.name]);
                                    else if (e.dim) return t = e.dim.split("x"), o.width = t[0], o.height = t[1], B(t), e.url && (A.attr("src", e.url), Se.attr("src", e.url), E.attr("src", e.url)), $()
                                })
                            }
                            var n = !{
                                "image/jpeg": !0,
                                "image/png": !0,
                                "image/gif": !0
                            }[o.mime],
                                t = !(!ot.option("substituteImg", o.hash) || !(n || o.size > Ye.dimSubImgSize)),
                                i = !(!o.width || !o.height);
                            if (G = l.find(".ui-dialog-titlebar .elfinder-titlebar-minimize").hide(), ot.bind("resize", Le), A.attr("src", q).one("error.dimreq", function () {
                                e()
                            }), Se.attr("src", q), E.attr("src", q), Ge && (E.on("mousedown touchstart", F.start).on("touchend", F.stop), l.on("mouseup", F.stop)), i && !t) return $();
                            if (o.size > (Ye.getDimThreshold || 0)) A.off("error.dimreq"), e();
                            else if (i) return $()
                        },
                        close: function () {
                            Ge && (E.off("mousedown touchstart", F.start).off("touchend", F.stop), st(document).off("mouseup", F.stop)), ot.unbind("resize", Le), st(this).elfinderdialog("destroy")
                        },
                        resize: function (e, t) {
                            t && "off" === t.minimize && Le()
                        }
                    }).attr("id", P).closest(".ui-dialog").addClass(at), ot.UA.ltIE8 && st(".elfinder-dialog").css("filter", ""), Oe.css({
                        opacity: .2,
                        "background-color": "#fff",
                        position: "absolute"
                    }), a.css("cursor", "move"), a.find(".elfinder-resize-handle-point").css({
                        "background-color": "#fff",
                        opacity: .5,
                        "border-color": "#000"
                    }), Ge || ce.find(".api2").remove(), f.find("input,select").prop("disabled", !0), f.find("input.elfinder-resize-quality").next("span").addClass("elfinder-resize-jpgsize").attr("title", ot.i18n("roughFileSize"))
                }
                var n, Ve, Ke, Xe = this,
                    i = this.files(e),
                    Je = st.Deferred(),
                    Ge = 1 < ot.api,
                    Ye = this.options,
                    Qe = 650,
                    Ze = ot.getUI(),
                    et = st().controlgroup ? "controlgroup" : "buttonset",
                    tt = void 0 === Ye.grid8px || "disable" !== Ye.grid8px,
                    nt = Array.isArray(Ye.presetSize) ? Ye.presetSize : [],
                    it = "elfinder-dialog-active",
                    at = ot.res("class", "editing");
                return i.length && -1 !== i[0].mime.indexOf("image/") ? (n = "resize-" + ot.namespace + "-" + i[0].hash, (e = Ze.find("#" + n)).length ? (e.elfinderdialog("toTop"), Je.resolve()) : (ot.openUrl(i[0].hash, "sameorigin", function (e) {
                    t(i[0], n, e)
                }), Je)) : Je.reject()
            }
        }, (f = jQuery).cssHooks.rotate = {
            get: function (e, t, n) {
                return f(e).rotate()
            },
            set: function (e, t) {
                return f(e).rotate(t), t
            }
        }, f.cssHooks.transform = {
            get: function (e, t, n) {
                var i = k(e.style, ["WebkitTransform", "MozTransform", "OTransform", "msTransform", "transform"]);
                return e.style[i]
            },
            set: function (e, t) {
                var n = k(e.style, ["WebkitTransform", "MozTransform", "OTransform", "msTransform", "transform"]);
                return e.style[n] = t
            }
        }, f.fn.rotate = function (e) {
            var t;
            return void 0 === e ? window.opera ? (t = this.css("transform").match(/rotate\((.*?)\)/)) && t[1] ? Math.round(180 * parseFloat(t[1]) / Math.PI) : 0 : (t = this.css("transform").match(/rotate\((.*?)\)/)) && t[1] ? parseInt(t[1]) : 0 : (this.css("transform", this.css("transform").replace(/none|rotate\(.*?\)/, "") + "rotate(" + parseInt(e) + "deg)"), this)
        }, f.fx.step.rotate = function (e) {
            0 == e.state && (e.start = f(e.elem).rotate(), e.now = e.start), f(e.elem).rotate(e.now)
        }, void 0 === window.addEventListener && void 0 === document.getElementsByClassName && (m = function (e) {
            for (var t = e, n = t.offsetLeft, i = t.offsetTop; t.offsetParent && ((t = t.offsetParent) == document.body || "static" == t.currentStyle.position);) t != document.body && t != document.documentElement && (n -= t.scrollLeft, i -= t.scrollTop), n += t.offsetLeft, i += t.offsetTop;
            return {
                x: n,
                y: i
            }
        }, g = function (e, t) {
            var n = 1,
                i = 1,
                a = 1,
                o = 1;
            if (void 0 !== e.style.msTransform) return !0;
            "static" == (s = e).currentStyle.position && (r = m(s), s.style.position = "absolute", s.style.left = r.x + "px", s.style.top = r.y + "px");
            var r = (s = t.match(/rotate\((.*?)\)/)) && s[1] ? parseInt(s[1]) : 0,
                t = (r = (r %= 360) < 0 ? 360 + r : r) * Math.PI / 180,
                s = Math.cos(t),
                l = Math.sin(t),
                l = (n *= s, i *= -l, a *= l, o *= s, e.style.filter = (e.style.filter || "").replace(/progid:DXImageTransform\.Microsoft\.Matrix\([^)]*\)/, "") + "progid:DXImageTransform.Microsoft.Matrix(M11=" + n + ",M12=" + i + ",M21=" + a + ",M22=" + o + ",FilterType='bilinear',sizingMethod='auto expand')", parseInt(e.style.width || e.width || 0)),
                s = parseInt(e.style.height || e.height || 0),
                t = r * Math.PI / 180,
                n = Math.abs(Math.cos(t)),
                i = Math.abs(Math.sin(t)),
                a = (s - (l * i + s * n)) / 2;
            return e.style.marginLeft = Math.floor((l - (l * n + s * i)) / 2) + "px", e.style.marginTop = Math.floor(a) + "px", !0
        }, v = f.cssHooks.transform.set, f.cssHooks.transform.set = function (e, t) {
            return v.apply(this, [e, t]), g(e, t), t
        }), (Fe.prototype.commands.restore = function () {
            "use strict";
            var a = this,
                u = this.fm,
                h = 0,
                f = function (e) {
                    var t, i = st.Deferred(),
                        n = [],
                        a = [],
                        o = [],
                        r = [];
                    return i._xhrReject = function () {
                        st.each(o, function () {
                            this && this.reject && this.reject()
                        }), t && t._xhrReject()
                    }, st.each(e, function (e, t) {
                        ("directory" === t.mime ? n : a).push(t)
                    }), n.length ? (st.each(n, function (e, t) {
                        o.push(u.request({
                            data: {
                                cmd: "open",
                                target: t.hash
                            },
                            preventDefault: !0,
                            asNotOpen: !0
                        })), r[e] = t.hash
                    }), st.when.apply(st, o).fail(function () {
                        i.reject()
                    }).done(function () {
                        var n = [];
                        st.each(arguments, function (e, t) {
                            t.files && (t.files.length ? n = n.concat(t.files) : n.push({
                                hash: "fakefile_" + h++,
                                phash: r[e],
                                mime: "fakefile",
                                name: "fakefile",
                                ts: 0
                            }))
                        }), u.cache(n), t = f(n).done(function (e) {
                            a = a.concat(e), i.resolve(a)
                        })
                    })) : i.resolve(a), i
                };
            this.restore = function (s, e, i, t) {
                var n, a, o, l = {},
                    c = [],
                    d = !1,
                    p = t || {},
                    r = +new Date;
                u.lockfiles({
                    files: i
                }), n = st.map(e, function (e) {
                    return "directory" === e.mime ? e.hash : null
                }), s.done(function () {
                    n && u.exec("rm", n, {
                        forceRm: !0,
                        quiet: !0
                    })
                }).always(function () {
                    u.unlockfiles({
                        files: i
                    })
                }), a = setTimeout(function () {
                    u.notify({
                        type: "search",
                        id: r,
                        cnt: 1,
                        hideCnt: !0,
                        cancel: function () {
                            o && o._xhrReject(), s.reject()
                        }
                    })
                }, u.notifyDelay), h = 0, o = f(e).always(function () {
                    a && clearTimeout(a), u.notify({
                        type: "search",
                        id: r,
                        cnt: -1,
                        hideCnt: !0
                    })
                }).fail(function () {
                    s.reject("errRestore", "errFileNotFound")
                }).done(function (e) {
                    var o = ["errRestore", "errFolderNotFound"],
                        r = "";
                    e.length ? (st.each(e, function (e, i) {
                        for (var t, n, a = i.phash; a;) {
                            if (t = u.trashes[a]) {
                                if (!l[t]) {
                                    if (d) return c.push(i.hash), null;
                                    l[t] = {}, d = !0
                                }
                                "" === (n = (n = u.path(i.hash).substr(u.path(a).length).replace(/\\/g, "/")).replace(/\/[^\/]+?$/, "")) && (n = "/"), l[t][n] || (l[t][n] = []), "fakefile" === i.mime ? u.updateCache({
                                    removed: [i.hash]
                                }) : l[t][n].push(i.hash), (!r || r.length > n.length) && (r = n);
                                break
                            } (t = u.file(a)) ? a = t.phash : (a = !1, st.each(u.trashes, function (e) {
                                var t = u.file(e),
                                    n = u.path(e);
                                if ((!t.volumeid || 0 === i.hash.indexOf(t.volumeid)) && 0 === u.path(i.hash).indexOf(n)) return a = e, !1
                            }))
                        }
                    }), d ? st.each(l, function (e, t) {
                        var n = Object.keys(t),
                            a = n.length;
                        u.request({
                            data: {
                                cmd: "mkdir",
                                target: e,
                                dirs: n
                            },
                            notify: {
                                type: "chkdir",
                                cnt: a
                            },
                            preventFail: !0
                        }).fail(function (e) {
                            s.reject(e), u.unlockfiles({
                                files: i
                            })
                        }).done(function (e) {
                            var i;
                            (i = e.hashes) ? u.getCommand("paste") ? u.one("mkdirdone", function () {
                                var n = !1;
                                st.each(t, function (e, t) {
                                    i[e] && (t.length ? u.file(i[e]) ? (u.clipboard(t, !0), u.exec("paste", [i[e]], {
                                        _cmd: "restore",
                                        noToast: p.noToast || e !== r
                                    }).done(function (e) {
                                        e && (e.error || e.warning) && (n = !0)
                                    }).fail(function () {
                                        n = !0
                                    }).always(function () {
                                        --a < 1 && (s[n ? "reject" : "resolve"](), c.length && u.exec("restore", c))
                                    })) : s.reject(o) : --a < 1 && (s.resolve(), c.length && u.exec("restore", c)))
                                })
                            }) : s.reject(["errRestore", "errCmdNoSupport", "(paste)"]) : s.reject(o)
                        })
                    }) : s.reject(o)) : (s.reject("errFileNotFound"), n && u.exec("rm", n, {
                        forceRm: !0,
                        quiet: !0
                    }))
                })
            }, this.linkedCmds = ["copy", "paste", "mkdir", "rm"], this.updateOnSelect = !1, this.init = function () {
                u = (a = this).fm
            }, this.getstate = function (e, t) {
                return (e = e || u.selected()).length && st.grep(e, function (e) {
                    e = u.file(e);
                    return !(!e || e.locked || u.isRoot(e))
                }).length == e.length ? 0 : -1
            }, this.exec = function (e, t) {
                var n = st.Deferred().fail(function (e) {
                    e && u.error(e)
                }),
                    i = a.files(e);
                return i.length ? (st.each(i, function (e, t) {
                    return u.isRoot(t) ? !n.reject(["errRestore", t.name]) : t.locked ? !n.reject(["errLocked", t.name]) : void 0
                }), "pending" === n.state() && this.restore(n, i, e, t), n) : n.reject()
            }
        }).prototype = {
            forceLoad: !0
        }, Fe.prototype.commands.rm = function () {
            "use strict";

            function u(t, e, n) {
                n = n ? {} : {
                    type: "rm",
                    cnt: e.length
                }, f.request({
                    data: {
                        cmd: "rm",
                        targets: e
                    },
                    notify: n,
                    preventFail: !0
                }).fail(function (e) {
                    t.reject(e)
                }).done(function (e) {
                    (e.error || e.warning) && (e.sync = !0), t.resolve(e)
                }).always(function () {
                    f.unlockfiles({
                        files: e
                    })
                })
            }

            function c(e) {
                var t, n = null;
                return e && e.length && (1 < e.length && 2 === f.searchStatus.state ? (t = f.file(f.root(e[0])).volumeid, st.grep(e, function (e) {
                    return 0 !== e.indexOf(t)
                }).length || (n = f.option("trashHash", e[0]))) : n = f.option("trashHash", e[0])), n
            }
            var h = this,
                f = this.fm,
                m = '<div class="ui-helper-clearfix elfinder-rm-title"><span class="elfinder-cwd-icon {class} ui-corner-all"></span>{title}<div class="elfinder-rm-desc">{desc}</div></div>',
                g = !1;
            this.confirm = function (e, t, n, i, a) {
                var o, r, s, l = t.length,
                    c = f.cwd().hash,
                    d = [],
                    p = f.i18n("calc") + '<span class="elfinder-spinner"></span>',
                    l = 1 < l ? (s = 0, st.each(n, function (e, t) {
                        if (!t.size || "unknown" == t.size || "directory" === t.mime) return !(s = "unknown");
                        t = parseInt(t.size);
                        0 <= t && 0 <= s && (s += t)
                    }), g = "unknown" === s, d.push(f.i18n("size") + ": " + (g ? p : f.formatSize(s))), [st(m.replace("{class}", "elfinder-cwd-icon-group").replace("{title}", "<strong>" + f.i18n("items") + ": " + l + "</strong>").replace("{desc}", d.join("<br>")))]) : (l = n[0], r = f.tmb(l), g = "directory" === l.mime, d.push(f.i18n("size") + ": " + (g ? p : f.formatSize(l.size))), d.push(f.i18n("modify") + ": " + f.formatDate(l)), p = f.escape(l.i18 || l.name).replace(/([_.])/g, "&#8203;$1"), [st(m.replace("{class}", f.mime2class(l.mime)).replace("{title}", "<strong>" + p + "</strong>").replace("{desc}", d.join("<br>")))]);
                (l = a ? l.concat(a) : l).push(i ? "confirmTrash" : "confirmRm"), o = f.confirm({
                    title: h.title,
                    text: l,
                    accept: {
                        label: "btnRm",
                        callback: function () {
                            i ? h.toTrash(e, t, i) : u(e, t)
                        }
                    },
                    cancel: {
                        label: "btnCancel",
                        callback: function () {
                            f.unlockfiles({
                                files: t
                            }), 1 === t.length && f.file(t[0]).phash !== c ? f.select({
                                selected: t
                            }) : f.selectfiles({
                                files: t
                            }), e.reject()
                        }
                    }
                }), r && st("<img/>").on("load", function () {
                    o.find(".elfinder-cwd-icon").addClass(r.className).css("background-image", "url('" + r.url + "')")
                }).attr("src", r.url), g = g && f.getSize(st.map(n, function (e) {
                    return "directory" === e.mime ? e.hash : null
                })).done(function (e) {
                    o.find("span.elfinder-spinner").parent().html(f.i18n("size") + ": " + e.formated)
                }).fail(function () {
                    o.find("span.elfinder-spinner").parent().html(f.i18n("size") + ": " + f.i18n("unknown"))
                }).always(function () {
                    g = !1
                })
            }, this.toTrash = function (d, p, e) {
                var t, n, u, s = {},
                    i = p.length,
                    a = h.options.toTrashMaxItems,
                    o = [],
                    r = st.Deferred();
                a < i ? h.confirm(d, p, h.files(p), null, [f.i18n("tooManyToTrash")]) : (st.each(p, function (e, t) {
                    var n = f.file(t),
                        i = f.path(t).replace(/\\/g, "/").match(/^[^\/]+?(\/(?:[^\/]+?\/)*)[^\/]+?$/);
                    n && (i && (i[1] = i[1].replace(/(^\/.*?)\/?$/, "$1"), s[i[1]] || (s[i[1]] = []), s[i[1]].push(t)), "directory" === n.mime && o.push(t))
                }), o.length ? (t = f.request({
                    data: {
                        cmd: "size",
                        targets: o
                    },
                    notify: {
                        type: "readdir",
                        cnt: 1,
                        hideCnt: !0
                    },
                    preventDefault: !0
                }).done(function (e) {
                    var t = 0;
                    e.fileCnt && (t += parseInt(e.fileCnt)), e.dirCnt && (t += parseInt(e.dirCnt)), r[a < t ? "reject" : "resolve"]()
                }).fail(function () {
                    r.reject()
                }), setTimeout(function () {
                    var e = t && t.xhr ? t.xhr : null;
                    e && "pending" == e.state() && (t.syncOnFail(!1), t.reject(), r.reject())
                }, 1e3 * h.options.infoCheckWait)) : r.resolve(), r.done(function () {
                    n = Object.keys(s), (u = n.length) ? f.request({
                        data: {
                            cmd: "mkdir",
                            target: e,
                            dirs: n
                        },
                        notify: {
                            type: "chkdir",
                            cnt: u
                        },
                        preventFail: !0
                    }).fail(function (e) {
                        d.reject(e), f.unlockfiles({
                            files: p
                        })
                    }).done(function (e) {
                        function n() {
                            return f.ui.notify.children(".elfinder-notify-trash").length
                        }
                        var i, a, o, r, l = ["errTrash"],
                            c = {};
                        (i = e.hashes) ? (o = 1 / u * 100, r = 1 === u ? 100 : 5, a = setTimeout(function () {
                            f.notify({
                                type: "trash",
                                cnt: 1,
                                hideCnt: !0,
                                progress: r
                            })
                        }, f.notifyDelay), st.each(s, function (e, t) {
                            var s;
                            f.file(t[0]).phash;
                            i[e] && (s = {
                                cmd: "paste",
                                dst: i[e],
                                targets: t,
                                cut: 1
                            }, f.request({
                                data: s,
                                preventDefault: !0
                            }).fail(function (e) {
                                e && (l = l.concat(e))
                            }).done(function (e) {
                                var t, n, i, a, o, r;
                                e = f.normalize(e), f.updateCache(e), t = e, n = s, st.each(t, function (e, t) {
                                    Array.isArray(t) && (c[e] ? c[e] = c[e].concat(t) : c[e] = t)
                                }), t.sync && (c.sync = 1), t.added && t.added.length && (i = function () {
                                    var n = [],
                                        i = st.map(t.added, function (e) {
                                            return "directory" === e.mime ? e.hash : null
                                        });
                                    return st.each(t.added, function (e, t) {
                                        -1 === st.inArray(t.phash, i) && n.push(t.hash)
                                    }), f.exec("restore", n, {
                                        noToast: !0
                                    })
                                }, o = function () {
                                    return f.request({
                                        data: n,
                                        notify: {
                                            type: "redo",
                                            cnt: p.length
                                        }
                                    })
                                }, c.undo ? (a = c.undo, c.undo = function () {
                                    i(), a()
                                }) : c.undo = i, c.redo ? (r = c.redo, c.redo = function () {
                                    o(), r()
                                }) : c.redo = o), e.warning && (l = l.concat(e.warning), delete e.warning), e.removed && e.removed.length && f.remove(e), e.added && e.added.length && f.add(e), e.changed && e.changed.length && f.change(e), f.trigger("paste", e), f.trigger("pastedone"), e.sync && f.sync()
                            }).always(function () {
                                var e = [],
                                    t = 2;
                                n() ? f.notify({
                                    type: "trash",
                                    cnt: 0,
                                    hideCnt: !0,
                                    progress: o
                                }) : r += o, --u < 1 && (a && clearTimeout(a), n() && f.notify({
                                    type: "trash",
                                    cnt: -1
                                }), f.unlockfiles({
                                    files: p
                                }), Object.keys(c).length ? (1 < l.length && ((e = c.removed || c.removed.length ? st.grep(p, function (e) {
                                    return -1 === st.inArray(e, c.removed)
                                }) : e).length ? (l.length > t && (t = -1 === (f.messages[l[t - 1]] || "").indexOf("$") ? t : t + 1), d.reject(), f.exec("rm", e, {
                                    addTexts: l.slice(0, t),
                                    forceRm: !0
                                })) : f.error(l)), c._noSound = !0, c.undo && c.redo && (c.undo = {
                                    cmd: "trash",
                                    callback: c.undo
                                }, c.redo = {
                                    cmd: "trash",
                                    callback: c.redo
                                }), d.resolve(c)) : d.reject(l))
                            }))
                        })) : (d.reject("errFolderNotFound"), f.unlockfiles({
                            files: p
                        }))
                    }) : (d.reject(["error", "The folder hierarchy to be deleting can not be determined."]), f.unlockfiles({
                        files: p
                    }))
                }).fail(function () {
                    h.confirm(d, p, h.files(p), null, [f.i18n("tooManyToTrash")])
                }))
            }, this.remove = u, this.syncTitleOnChange = !0, this.updateOnSelect = !1, this.shortcuts = [{
                pattern: "delete ctrl+backspace shift+delete"
            }], this.value = "rm", this.init = function () {
                function t(e) {
                    var n;
                    delete h.extra, h.title = f.i18n("cmd" + h.value), h.className = h.value, h.button && h.button.children("span.elfinder-button-icon")["trash" === h.value ? "addClass" : "removeClass"]("elfinder-button-icon-trash"), e && "cwd" !== e && (-1 < h.state || "navbar" === e) && "trash" === h.value && (h.extra = {
                        icon: "rm",
                        node: st("<span></span>").attr({
                            title: f.i18n("cmdrm")
                        }).on("ready", function (e, t) {
                            n = t.targets
                        }).on("click touchstart", function (e) {
                            "touchstart" === e.type && 1 < e.originalEvent.touches.length || (e.stopPropagation(), e.preventDefault(), f.getUI().trigger("click"), f.exec("rm", n, {
                                _userAction: !0,
                                forceRm: !0
                            }))
                        })
                    })
                }
                f = (h = this).fm, h.change(function () {
                    t()
                }), f.bind("contextmenucreate", function (e) {
                    t(e.data.type)
                })
            }, this.getstate = function (e) {
                var t, e = this.hashes(e);
                return e.length && (t = !0, st.grep(e, function (e) {
                    return t = !(!t || !(e = f.file(e)) || e.locked || f.isRoot(e))
                }).length == e.length) ? 0 : -1
            }, this.exec = function (e, t) {
                var n = t || {},
                    i = st.Deferred().always(function () {
                        g && g.state && "pending" === g.state() && g.reject()
                    }).fail(function (e) {
                        e && f.error(e)
                    }).done(function (e) {
                        !n.quiet && !e._noSound && e.removed && e.removed.length && f.trigger("playsound", {
                            soundFile: "rm.wav"
                        })
                    }),
                    t = h.files(e),
                    a = t.length,
                    o = null,
                    r = n.addTexts || null,
                    s = n.forceRm,
                    l = n.quiet;
                return a ? (st.each(t, function (e, t) {
                    return f.isRoot(t) ? !i.reject(["errRm", t.name, "errPerm"]) : t.locked ? !i.reject(["errLocked", t.name]) : void 0
                }), "pending" === i.state() && (a = h.hashes(e), t.length, (s || h.event && h.event.originalEvent && h.event.originalEvent.shiftKey) && (o = "", h.title = f.i18n("cmdrm")), null === o && (o = c(a)), f.lockfiles({
                    files: a
                }), o && h.options.quickTrash ? h.toTrash(i, a, o) : l ? u(i, a, l) : h.confirm(i, a, t, o, r)), i) : i.reject()
            }, f.bind("select contextmenucreate closecontextmenu", function (e) {
                e = (e.data ? e.data.selected || e.data.targets : null) || f.selected();
                e && e.length && h.update(void 0, (e ? c(e) : f.option("trashHash")) ? "trash" : "rm")
            })
        }, Fe.prototype.commands.search = function () {
            "use strict";
            this.title = "Find files", this.options = {
                ui: "searchbutton"
            }, this.alwaysEnabled = !0, this.updateOnSelect = !1, this.getstate = function () {
                return 0
            }, this.exec = function (n, i, a, e) {
                function o(e) {
                    return t && "SearchName" !== t && "SearchMime" !== t && (e.type = t), e
                }
                var r, s, l = this.fm,
                    c = [],
                    t = e || "",
                    d = l.options.onlyMimes,
                    p = [];
                return "string" == typeof n && n ? ("object" == typeof i && (a = i.mime || "", i = i.target || ""), i = i || "", a ? (a = st.trim(a).replace(",", " ").split(" "), d.length && (a = st.map(a, function (t) {
                    return (t = st.trim(t)) && (-1 !== st.inArray(t, d) || st.grep(d, function (e) {
                        return 0 === t.indexOf(e)
                    }).length) ? t : null
                }))) : a = [].concat(d), l.trigger("searchstart", o({
                    query: n,
                    target: i,
                    mimes: a
                })), !d.length || a.length ? "" === i && 2.1 <= l.api ? (s = Object.keys(l.roots).length, st.each(l.roots, function (e, t) {
                    c.push(l.request({
                        data: o({
                            cmd: "search",
                            q: n,
                            target: t,
                            mimes: a
                        }),
                        notify: {
                            type: "search",
                            cnt: 1,
                            hideCnt: !(1 < s)
                        },
                        cancel: !0,
                        preventDone: !0
                    }))
                })) : (c.push(l.request({
                    data: o({
                        cmd: "search",
                        q: n,
                        target: i,
                        mimes: a
                    }),
                    notify: {
                        type: "search",
                        cnt: 1,
                        hideCnt: !0
                    },
                    cancel: !0,
                    preventDone: !0
                })), "" !== i && 2.1 <= l.api && Object.keys(l.leafRoots).length && st.each(l.leafRoots, function (e, t) {
                    for (r = e; r;) i === r && st.each(t, function () {
                        var e = l.file(this);
                        e && e.volumeid && p.push(e.volumeid), c.push(l.request({
                            data: o({
                                cmd: "search",
                                q: n,
                                target: this,
                                mimes: a
                            }),
                            notify: {
                                type: "search",
                                cnt: 1,
                                hideCnt: !1
                            },
                            cancel: !0,
                            preventDone: !0
                        }))
                    }), r = (l.file(r) || {}).phash
                })) : c = [st.Deferred().resolve({
                    files: []
                })], l.searchStatus.mixed = 1 < c.length && p, st.when.apply(st, c).done(function (e) {
                    var t, n = arguments.length;
                    if (e.warning && l.error(e.warning), 1 < n)
                        for (e.files = e.files || [], t = 1; t < n; t++) arguments[t].warning && l.error(arguments[t].warning), arguments[t].files && e.files.push.apply(e.files, arguments[t].files);
                    e.files && e.files.length && l.cache(e.files), l.lazy(function () {
                        l.trigger("search", e)
                    }).then(function () {
                        return l.lazy(function () {
                            l.trigger("searchdone")
                        })
                    }).then(function () {
                        e.sync && l.sync()
                    })
                })) : (l.getUI("toolbar").find("." + l.res("class", "searchbtn") + " :text").trigger("focus"), st.Deferred().reject())
            }
        }, Fe.prototype.commands.selectall = function () {
            "use strict";
            var t = 0;
            this.fm.bind("select", function (e) {
                t = e.data && e.data.selectall ? -1 : 0
            }), this.state = 0, this.updateOnSelect = !1, this.getstate = function () {
                return t
            }, this.exec = function () {
                return st(document).trigger(st.Event("keydown", {
                    keyCode: 65,
                    ctrlKey: !0,
                    shiftKey: !1,
                    altKey: !1,
                    metaKey: !1
                })), st.Deferred().resolve()
            }
        }, Fe.prototype.commands.selectinvert = function () {
            "use strict";
            this.updateOnSelect = !1, this.getstate = function () {
                return 0
            }, this.exec = function () {
                return st(document).trigger(st.Event("keydown", {
                    keyCode: 73,
                    ctrlKey: !0,
                    shiftKey: !0,
                    altKey: !1,
                    metaKey: !1
                })), st.Deferred().resolve()
            }
        }, Fe.prototype.commands.selectnone = function () {
            "use strict";
            var e = this.fm,
                t = -1;
            e.bind("select", function (e) {
                t = e.data && e.data.unselectall ? -1 : 0
            }), this.state = -1, this.updateOnSelect = !1, this.getstate = function () {
                return t
            }, this.exec = function () {
                return e.getUI("cwd").trigger("unselectall"), st.Deferred().resolve()
            }
        }, Fe.prototype.commands.sort = function () {
            "use strict";

            function e() {
                i.variants = [], st.each(r.sortRules, function (e, t) {
                    var n;
                    r.sorters[e] && (n = e === r.sortType ? "asc" === r.sortOrder ? "n" : "s" : "", i.variants.push([e, (n ? '<span class="ui-icon ui-icon-arrowthick-1-' + n + '"></span>' : "") + "&nbsp;" + r.i18n("sort" + e)]))
                }), i.variants.push("|"), i.variants.push(["stick", (r.sortStickFolders ? '<span class="ui-icon ui-icon-check"></span>' : "") + "&nbsp;" + r.i18n("sortFoldersFirst")]), r.ui.tree && null !== r.options.sortAlsoTreeview && (i.variants.push("|"), i.variants.push(["tree", (r.sortAlsoTreeview ? '<span class="ui-icon ui-icon-check"></span>' : "") + "&nbsp;" + r.i18n("sortAlsoTreeview")]));
                var e = r.getUI("contextmenu");
                e.is(":visible") && ((e = (e = e.find("span.elfinder-button-icon-sort")).siblings("div.elfinder-contextmenu-sub")).find("span.ui-icon").remove(), e.children("div.elfinder-contextsubmenu-item").each(function () {
                    var e = st(this).children("span"),
                        t = e.text().trim();
                    t === (n.stick || (n.stick = r.i18n("sortFoldersFirst"))) ? r.sortStickFolders && e.prepend('<span class="ui-icon ui-icon-check"></span>') : t === (n.tree || (n.tree = r.i18n("sortAlsoTreeview"))) ? r.sortAlsoTreeview && e.prepend('<span class="ui-icon ui-icon-check"></span>') : t === (n[r.sortType] || (n[r.sortType] = r.i18n("sort" + r.sortType))) && (t = "asc" === r.sortOrder ? "n" : "s", e.prepend('<span class="ui-icon ui-icon-arrowthick-1-' + t + '"></span>'))
                }))
            }
            var i = this,
                r = i.fm,
                n = {};
            this.options = {
                ui: "sortbutton"
            }, this.keepContextmenu = !0, r.bind("sortchange", e).bind("sorterupdate", function () {
                e(), r.getUI().children(".elfinder-button-sort-menu").children(".elfinder-button-menu-item").each(function () {
                    var e = st(this),
                        t = e.attr("rel");
                    e.toggle(!(t && !r.sorters[t]))
                })
            }).bind("cwdrender", function () {
                var o = st(r.cwd).find("div.elfinder-cwd-wrapper-list table");
                o.length && st.each(r.sortRules, function (e, t) {
                    var n, i, a = o.find("thead tr td.elfinder-cwd-view-th-" + e);
                    a.length && (n = e == r.sortType, i = {
                        type: e,
                        order: n ? "asc" == r.sortOrder ? "desc" : "asc" : r.sortOrder
                    }, n && (a.addClass("ui-state-active"), e = "asc" == r.sortOrder ? "n" : "s", st('<span class="ui-icon ui-icon-triangle-1-' + e + '"></span>').appendTo(a)), st(a).on("click", function (e) {
                        st(this).data("dragging") || (e.stopPropagation(), r.getUI("cwd").data("longtap") || r.exec("sort", [], i))
                    }).on("mouseenter mouseleave", function (e) {
                        st(this).toggleClass("ui-state-hover", "mouseenter" === e.type)
                    }))
                })
            }), this.getstate = function () {
                return 0
            }, this.exec = function (e, t) {
                var n, i = this.fm,
                    t = st.isPlainObject(t) ? t : (n = {}, "stick" === (t += "") ? n.stick = !i.sortStickFolders : "tree" === t ? n.tree = !i.sortAlsoTreeview : i.sorters[t] && (i.sortType === t ? n.order = "asc" === i.sortOrder ? "desc" : "asc" : n.type = t), n),
                    a = Object.assign({
                        type: i.sortType,
                        order: i.sortOrder,
                        stick: i.sortStickFolders,
                        tree: i.sortAlsoTreeview
                    }, t);
                return i.lazy(function () {
                    i.setSort(a.type, a.order, a.stick, a.tree), this.resolve()
                })
            }
        }, Fe.prototype.commands.undo = function () {
            "use strict";

            function o(e) {
                e ? (t.title = r.i18n("cmdundo") + " " + r.i18n("cmd" + e.cmd), t.state = 0) : (t.title = r.i18n("cmdundo"), t.state = -1), t.change()
            }
            var t = this,
                r = this.fm,
                s = [];
            this.alwaysEnabled = !0, this.updateOnSelect = !1, this.shortcuts = [{
                pattern: "ctrl+z"
            }], this.syncTitleOnChange = !0, this.getstate = function () {
                return s.length ? 0 : -1
            }, this.setUndo = function (e, t) {
                var n = {};
                e && st.isPlainObject(e) && e.cmd && e.callback && (Object.assign(n, e), t ? (delete t.undo, n.redo = t) : r.getCommand("redo").setRedo(null), s.push(n), o(n))
            }, this.exec = function () {
                var e, t, n = r.getCommand("redo"),
                    i = st.Deferred(),
                    a = {};
                return s.length ? ((e = s.pop()).redo ? (Object.assign(a, e.redo), delete e.redo) : a = null, i.done(function () {
                    a && n.setRedo(a, e)
                }), o(s.length ? s[s.length - 1] : void 0), (t = e.callback()) && t.done ? t.done(function () {
                    i.resolve()
                }).fail(function () {
                    i.reject()
                }) : i.resolve(), s.length ? this.update(0, s[s.length - 1].name) : this.update(-1, "")) : i.reject(), i
            }, r.bind("exec", function (e) {
                e = e.data || {};
                e.opts && e.opts._userAction && e.dfrd && e.dfrd.done && e.dfrd.done(function (e) {
                    e && e.undo && e.redo && (e.undo.redo = e.redo, t.setUndo(e.undo))
                })
            })
        }, Fe.prototype.commands.redo = function () {
            "use strict";

            function o(e) {
                e && e.callback ? (t.title = r.i18n("cmdredo") + " " + r.i18n("cmd" + e.cmd), t.state = 0) : (t.title = r.i18n("cmdredo"), t.state = -1), t.change()
            }
            var t = this,
                r = this.fm,
                s = [];
            this.alwaysEnabled = !0, this.updateOnSelect = !1, this.shortcuts = [{
                pattern: "shift+ctrl+z ctrl+y"
            }], this.syncTitleOnChange = !0, this.getstate = function () {
                return s.length ? 0 : -1
            }, this.setRedo = function (e, t) {
                null === e ? (s = [], o()) : e && e.cmd && e.callback && (t && (e.undo = t), s.push(e), o(e))
            }, this.exec = function () {
                var e, t = r.getCommand("undo"),
                    n = st.Deferred(),
                    i = {},
                    a = {};
                return s.length ? ((e = s.pop()).undo && (Object.assign(i, e.undo), Object.assign(a, e), delete a.undo, n.done(function () {
                    t.setUndo(i, a)
                })), o(s.length ? s[s.length - 1] : void 0), (e = e.callback()) && e.done ? e.done(function () {
                    n.resolve()
                }).fail(function () {
                    n.reject()
                }) : n.resolve(), n) : n.reject()
            }
        }, (Fe.prototype.commands.up = function () {
            "use strict";
            this.alwaysEnabled = !0, this.updateOnSelect = !1, this.shortcuts = [{
                pattern: "ctrl+up"
            }], this.getstate = function () {
                return this.fm.cwd().phash ? 0 : -1
            }, this.exec = function () {
                var e = this.fm,
                    t = e.cwd().hash;
                return this.fm.cwd().phash ? this.fm.exec("open", this.fm.cwd().phash).done(function () {
                    e.one("opendone", function () {
                        e.selectfiles({
                            files: [t]
                        })
                    })
                }) : st.Deferred().reject()
            }
        }).prototype = {
            forceLoad: !0
        }, Fe.prototype.commands.upload = function () {
            "use strict";
            var b = this.fm.res("class", "hover");
            this.disableOnSearch = !0, this.updateOnSelect = !1, this.shortcuts = [{
                pattern: "ctrl+u"
            }], this.getstate = function (e) {
                var t, n = this.fm,
                    e = e || [n.cwd().hash];
                return (t = this._disabled || 1 != e.length ? t : n.file(e[0])) && "directory" == t.mime && t.write ? 0 : -1
            }, this.exec = function (e) {
                function t() {
                    var e = h.hash,
                        t = st.map(d.files(e), function (e) {
                            return "directory" === e.mime && e.write ? e : null
                        });
                    return t.length ? st('<div class="elfinder-upload-dirselect elfinder-tabstop" title="' + d.i18n("folders") + '"></div>').on("click", function (e) {
                        e.stopPropagation(), e.preventDefault(), t = d.sortFiles(t);

                        function n(t, e) {
                            return {
                                label: d.escape(t.i18 || t.name),
                                icon: e,
                                remain: !1,
                                callback: function () {
                                    var e = a.children(".ui-dialog-titlebar:first").find("span.elfinder-upload-target");
                                    p = [t.hash], e.html(" - " + d.escape(t.i18 || t.name)), i.trigger("focus")
                                },
                                options: {
                                    className: p && p.length && t.hash === p[0] ? "ui-state-active" : "",
                                    iconClass: t.csscls || "",
                                    iconImg: t.icon || ""
                                }
                            }
                        }
                        var i = st(this),
                            a = (d.cwd(), r.closest("div.ui-dialog")),
                            o = [n(h, "opendir"), "|"];
                        st.each(t, function (e, t) {
                            o.push(n(t, "dir"))
                        }), i.trigger("blur"), d.trigger("contextmenu", {
                            raw: o,
                            x: e.pageX || st(this).offset().left,
                            y: e.pageY || st(this).offset().top,
                            prevNode: a,
                            fitHeight: !0
                        })
                    }).append('<span class="elfinder-button-icon elfinder-button-icon-dir" ></span>') : st()
                }

                function n(e, t) {
                    var n = st('<input type="file" ' + e + "/>").on("click", function () {
                        d.UA.IE && setTimeout(function () {
                            i.css("display", "none").css("position", "relative"), requestAnimationFrame(function () {
                                i.css("display", "").css("position", "")
                            })
                        }, 100)
                    }).on("change", function () {
                        m({
                            input: n.get(0),
                            type: "files"
                        })
                    }).on("dragover", function (e) {
                        e.originalEvent.dataTransfer.dropEffect = "copy"
                    }),
                        i = st("<form></form>").append(n).on("click", function (e) {
                            e.stopPropagation()
                        });
                    return st('<div class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only elfinder-tabstop elfinder-focus"><span class="ui-button-text">' + d.i18n(t) + "</span></div>").append(i).on("click", function (e) {
                        e.stopPropagation(), e.preventDefault(), n.trigger("click")
                    }).on("mouseenter mouseleave", function (e) {
                        st(this).toggleClass(b, "mouseenter" === e.type)
                    })
                }
                var r, i, a, o, s, l, d = this.fm,
                    c = d.cwd().hash,
                    p = (s = e && e instanceof Array ? e : null, (!e || e instanceof Array) && (s || 1 !== (l = d.selected()).length || "directory" !== d.file(l[0]).mime ? s && 1 === s.length && "directory" === d.file(s[0]).mime || (s = [c]) : s = l), s),
                    u = p ? p[0] : e && e.target ? e.target : null,
                    h = u ? d.file(u) : d.cwd(),
                    f = function (e) {
                        d.upload(e).fail(function (e) {
                            g.reject(e)
                        }).done(function (e) {
                            var t, n;
                            d.getUI("cwd");
                            g.resolve(e), e && e.added && e.added[0] && !d.ui.notify.children(".elfinder-notify-upload").length && ((n = d.findCwdNodes(e.added)).length ? n.trigger("scrolltoview") : (h.hash !== c ? t = st("<div></div>").append(st('<button type="button" class="ui-button ui-widget ui-state-default ui-corner-all elfinder-tabstop"><span class="ui-button-text">' + d.i18n("cmdopendir") + "</span></button>").on("mouseenter mouseleave", function (e) {
                                st(this).toggleClass("ui-state-hover", "mouseenter" == e.type)
                            }).on("click", function () {
                                d.exec("open", u).done(function () {
                                    d.one("opendone", function () {
                                        d.trigger("selectfiles", {
                                            files: st.map(e.added, function (e) {
                                                return e.hash
                                            })
                                        })
                                    })
                                })
                            })) : d.trigger("selectfiles", {
                                files: st.map(e.added, function (e) {
                                    return e.hash
                                })
                            }), d.toast({
                                msg: d.i18n(["complete", d.i18n("cmdupload")]),
                                extNode: t
                            })))
                        }).progress(function () {
                            g.notifyWith(this, Array.from(arguments))
                        })
                    },
                    m = function (e) {
                        r.elfinderdialog("close"), p && (e.target = p[0]), f(e)
                    },
                    g = st.Deferred(),
                    v = function (e) {
                        e.stopPropagation(), e.preventDefault();
                        var t, n, i, a = !1,
                            o = "",
                            r = null,
                            s = e._target || null,
                            l = e.dataTransfer || null,
                            c = "";
                        if (l) {
                            l.types && l.types.length ? -1 === (n = st.inArray("application/x-moz-file", l.types)) && -1 === (n = st.inArray("Files", l.types)) || (c = "file") : l.items && l.items.length && l.items[0].kind && (c = l.items[0].kind);
                            try {
                                if ((i = l.getData("elfinderfrom")) && (t = window.location.href + d.cwd().hash, !s && i === t || s === t)) return void g.reject()
                            } catch (e) { }
                            if ("file" === c && (l.items[n].getAsEntry || l.items[n].webkitGetAsEntry || l.items[n].getAsFile)) a = l, o = "data";
                            else if ("string" !== c && l.files && l.files.length && -1 === st.inArray("Text", l.types)) a = l.files, o = "files";
                            else {
                                try {
                                    (r = l.getData("text/html")) && r.match(/<(?:img|a)/i) && (a = [r], o = "html")
                                } catch (e) { }
                                a || ((r = l.getData("text")) ? (a = [r], o = "text") : l && l.files && (c = "file"))
                            }
                        }
                        a ? f({
                            files: a,
                            type: o,
                            target: s,
                            dropEvt: e
                        }) : (i = ["errUploadNoFiles"], "file" === c && i.push("errFolderUpload"), d.error(i), g.reject())
                    };
                return !p && e ? e.input || e.files ? (e.type = "files", f(e)) : e.dropEvt && v(e.dropEvt) : (i = function (e) {
                    var t, n = e.originalEvent || e,
                        i = [];
                    if (n.clipboardData) {
                        if (n.clipboardData.items && n.clipboardData.items.length)
                            for (var a = n.clipboardData.items, o = 0; o < a.length; o++) "file" == n.clipboardData.items[o].kind && (t = n.clipboardData.items[o].getAsFile(), i.push(t));
                        else n.clipboardData.files && n.clipboardData.files.length && (i = n.clipboardData.files);
                        if (i.length) return void m({
                            files: i,
                            type: "files",
                            clipdata: !0
                        })
                    }
                    var r = n.target || n.srcElement;
                    requestAnimationFrame(function () {
                        var e, t = "text";
                        r.innerHTML && (st(r).find("img").each(function (e, t) {
                            t.src.match(/^webkit-fake-url:\/\//) && st(t).remove()
                        }), st(r).find("a,img").length && (t = "html"), e = r.innerHTML, r.innerHTML = "", m({
                            files: [e],
                            type: t
                        }))
                    })
                }, r = st('<div class="elfinder-upload-dialog-wrapper"></div>').append(n("multiple", "selectForUpload")), d.UA.Mobile || void 0 === (l = document.createElement("input")).webkitdirectory && void 0 === l.directory || r.append(n("multiple webkitdirectory directory", "selectFolder")), h.dirs && (h.hash === c || d.navHash2Elm(h.hash).hasClass("elfinder-subtree-loaded") ? t().appendTo(r) : (a = st('<div class="elfinder-upload-dirselect" title="' + d.i18n("nowLoading") + '"></div>').append('<span class="elfinder-button-icon elfinder-button-icon-spinner" ></span>').appendTo(r), d.request({
                    cmd: "tree",
                    target: h.hash
                }).done(function () {
                    d.one("treedone", function () {
                        a.replaceWith(t()), o.elfinderdialog("tabstopsInit")
                    })
                }).fail(function () {
                    a.remove()
                }))), d.dragUpload ? st('<div class="ui-corner-all elfinder-upload-dropbox elfinder-tabstop" contenteditable="true" data-ph="' + d.i18n("dropPasteFiles") + '"></div>').on("paste", function (e) {
                    i(e)
                }).on("mousedown click", function () {
                    st(this).trigger("focus")
                }).on("focus", function () {
                    this.innerHTML = ""
                }).on("mouseover", function () {
                    st(this).addClass(b)
                }).on("mouseout", function () {
                    st(this).removeClass(b)
                }).on("dragenter", function (e) {
                    e.stopPropagation(), e.preventDefault(), st(this).addClass(b)
                }).on("dragleave", function (e) {
                    e.stopPropagation(), e.preventDefault(), st(this).removeClass(b)
                }).on("dragover", function (e) {
                    e.stopPropagation(), e.preventDefault(), e.originalEvent.dataTransfer.dropEffect = "copy", st(this).addClass(b)
                }).on("drop", function (e) {
                    r.elfinderdialog("close"), p && (e.originalEvent._target = p[0]), v(e.originalEvent)
                }).prependTo(r).after('<div class="elfinder-upload-dialog-or">' + d.i18n("or") + "</div>")[0] : st('<div class="ui-corner-all elfinder-upload-dropbox" contenteditable="true">' + d.i18n("dropFilesBrowser") + "</div>").on("paste drop", function (e) {
                    i(e)
                }).on("mousedown click", function () {
                    st(this).trigger("focus")
                }).on("focus", function () {
                    this.innerHTML = ""
                }).on("dragenter mouseover", function () {
                    st(this).addClass(b)
                }).on("dragleave mouseout", function () {
                    st(this).removeClass(b)
                }).prependTo(r).after('<div class="elfinder-upload-dialog-or">' + d.i18n("or") + "</div>")[0], o = this.fmDialog(r, {
                    title: this.title + '<span class="elfinder-upload-target">' + (h ? " - " + d.escape(h.i18 || h.name) : "") + "</span>",
                    modal: !0,
                    resizable: !1,
                    destroyOnClose: !0,
                    propagationEvents: ["mousemove", "mouseup", "click"],
                    close: function () {
                        var e = d.getUI("contextmenu");
                        e.is(":visible") && e.click()
                    }
                })), g
            }
        }, Fe.prototype.commands.view = function () {
            "use strict";
            var a, o = this,
                r = this.fm;
            this.value = r.viewType, this.alwaysEnabled = !0, this.updateOnSelect = !1, this.options = {
                ui: "viewbutton"
            }, this.getstate = function () {
                return 0
            }, this.extra = {
                icon: "menu",
                node: st("<span></span>").attr({
                    title: r.i18n("viewtype")
                }).on("click touchstart", function (e) {
                    var t;
                    "touchstart" === e.type && 1 < e.originalEvent.touches.length || (t = st(this), e.stopPropagation(), e.preventDefault(), r.trigger("contextmenu", {
                        raw: getSubMenuRaw(),
                        x: t.offset().left,
                        y: t.offset().top
                    }))
                })
            }, this.exec = function () {
                var e = this,
                    t = "list" == this.value ? "icons" : "list";
                return r.storage("view", t), r.lazy(function () {
                    r.viewchange(), e.update(void 0, t), this.resolve()
                })
            }, r.bind("init", function () {
                a = function () {
                    for (var t = r.getUI("cwd"), e = [], n = r.options.uiOptions.cwd.iconsView.sizeNames, i = r.options.uiOptions.cwd.iconsView.sizeMax, a = 0; a <= i; a++) e.push({
                        label: r.i18n(n[a] || "Size-" + a + " icons"),
                        icon: "view",
                        callback: function (e) {
                            return function () {
                                t.trigger("iconpref", {
                                    size: e
                                }), r.storage("iconsize", e), "list" === o.value && o.exec()
                            }
                        }(a)
                    });
                    return e.push("|"), e.push({
                        label: r.i18n("viewlist"),
                        icon: "view-list",
                        callback: function () {
                            "list" !== o.value && o.exec()
                        }
                    }), e
                }()
            }).bind("contextmenucreate", function () {
                o.extra = {
                    icon: "menu",
                    node: st("<span></span>").attr({
                        title: r.i18n("cmdview")
                    }).on("click touchstart", function (e) {
                        if (!("touchstart" === e.type && 1 < e.originalEvent.touches.length)) {
                            for (var t = st(this), n = (a.concat(), "list" === o.value ? a.length - 1 : parseInt(r.storage("iconsize") || 0)), i = 0; i < a.length; i++) "|" !== a[i] && (a[i].options = i === n ? {
                                className: "ui-state-active"
                            } : void 0);
                            e.stopPropagation(), e.preventDefault(), r.trigger("contextmenu", {
                                raw: a,
                                x: t.offset().left,
                                y: t.offset().top
                            })
                        }
                    })
                }
            })
        }, Fe
});