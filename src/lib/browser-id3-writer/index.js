!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.ID3Writer = t()
}(this, function() {
    "use strict";
    function e(e, t) {
        if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function")
    }
    function t(e) {
        return String(e).split("").map(function(e) {
            return e.charCodeAt(0)
        })
    }
    function r(e) {
        return new Uint8Array(t(e))
    }
    function n(e) {
        var r = new Uint8Array(2 * e.length);
        return new Uint16Array(r.buffer).set(t(e)),
        r
    }
    function a(e) {
        return 73 === e[0] && 68 === e[1] && 51 === e[2]
    }
    function i(e) {
        if (!e || !e.length)
            return null;
        if (255 === e[0] && 216 === e[1] && 255 === e[2])
            return "image/jpeg";
        if (137 === e[0] && 80 === e[1] && 78 === e[2] && 71 === e[3])
            return "image/png";
        if (71 === e[0] && 73 === e[1] && 70 === e[2])
            return "image/gif";
        if (87 === e[8] && 69 === e[9] && 66 === e[10] && 80 === e[11])
            return "image/webp";
        var t = 73 === e[0] && 73 === e[1] && 42 === e[2] && 0 === e[3]
          , r = 77 === e[0] && 77 === e[1] && 0 === e[2] && 42 === e[3];
        return t || r ? "image/tiff" : 66 === e[0] && 77 === e[1] ? "image/bmp" : 0 === e[0] && 0 === e[1] && 1 === e[2] && 0 === e[3] ? "image/x-icon" : null
    }
    function s(e) {
        return [e >>> 24 & 255, e >>> 16 & 255, e >>> 8 & 255, 255 & e]
    }
    function o(e) {
        return [e >>> 21 & 127, e >>> 14 & 127, e >>> 7 & 127, 127 & e]
    }
    function c(e) {
        return (e[0] << 21) + (e[1] << 14) + (e[2] << 7) + e[3]
    }
    function u(e) {
        return 11 + e
    }
    function f(e) {
        return 13 + 2 * e
    }
    function h(e, t) {
        return 16 + 2 * e + 2 + 2 + 2 * t
    }
    function p(e, t, r, n) {
        return 11 + t + 1 + 1 + (n ? 2 + 2 * (r + 1) : r + 1) + e
    }
    function l(e, t) {
        return 16 + 2 * e + 2 + 2 + 2 * t
    }
    function g(e, t) {
        return 13 + 2 * e + 2 + 2 + 2 * t
    }
    function m(e) {
        return 10 + e
    }
    return function() {
        function t(r) {
            if (e(this, t),
            !(r && "object" == typeof r && "byteLength"in r))
                throw new Error("First argument should be an instance of ArrayBuffer or Buffer");
            this.arrayBuffer = r,
            this.padding = 4096,
            this.frames = [],
            this.url = ""
        }
        return t.prototype._setIntegerFrame = function(e, t) {
            var r = parseInt(t, 10);
            this.frames.push({
                name: e,
                value: r,
                size: u(r.toString().length)
            })
        }
        ,
        t.prototype._setStringFrame = function(e, t) {
            var r = t.toString();
            this.frames.push({
                name: e,
                value: r,
                size: f(r.length)
            })
        }
        ,
        t.prototype._setPictureFrame = function(e, t, r, n) {
            var a = i(new Uint8Array(t))
              , s = r.toString();
            if (!a)
                throw new Error("Unknown picture MIME type");
            r || (n = !1),
            this.frames.push({
                name: "APIC",
                value: t,
                pictureType: e,
                mimeType: a,
                useUnicodeEncoding: n,
                description: s,
                size: p(t.byteLength, a.length, s.length, n)
            })
        }
        ,
        t.prototype._setLyricsFrame = function(e, t) {
            var r = e.toString()
              , n = t.toString();
            this.frames.push({
                name: "USLT",
                value: n,
                description: r,
                size: h(r.length, n.length)
            })
        }
        ,
        t.prototype._setCommentFrame = function(e, t) {
            var r = e.toString()
              , n = t.toString();
            this.frames.push({
                name: "COMM",
                value: n,
                description: r,
                size: l(r.length, n.length)
            })
        }
        ,
        t.prototype._setUserStringFrame = function(e, t) {
            var r = e.toString()
              , n = t.toString();
            this.frames.push({
                name: "TXXX",
                description: r,
                value: n,
                size: g(r.length, n.length)
            })
        }
        ,
        t.prototype._setUrlLinkFrame = function(e, t) {
            var r = t.toString();
            this.frames.push({
                name: e,
                value: r,
                size: m(r.length)
            })
        }
        ,
        t.prototype.setFrame = function(e, t) {
            switch (e) {
            case "TPE1":
            case "TCOM":
            case "TCON":
                if (!Array.isArray(t))
                    throw new Error(e + " frame value should be an array of strings");
                var r = "TCON" === e ? ";" : "/"
                  , n = t.join(r);
                this._setStringFrame(e, n);
                break;
            case "TIT2":
            case "TALB":
            case "TPE2":
            case "TPE3":
            case "TPE4":
            case "TRCK":
            case "TPOS":
            case "TMED":
            case "TPUB":
                this._setStringFrame(e, t);
                break;
            case "TBPM":
            case "TLEN":
            case "TYER":
                this._setIntegerFrame(e, t);
                break;
            case "USLT":
                if (!("object" == typeof t && "description"in t && "lyrics"in t))
                    throw new Error("USLT frame value should be an object with keys description and lyrics");
                this._setLyricsFrame(t.description, t.lyrics);
                break;
            case "APIC":
                if (!("object" == typeof t && "type"in t && "data"in t && "description"in t))
                    throw new Error("APIC frame value should be an object with keys type, data and description");
                if (t.type < 0 || t.type > 20)
                    throw new Error("Incorrect APIC frame picture type");
                this._setPictureFrame(t.type, t.data, t.description, !!t.useUnicodeEncoding);
                break;
            case "TXXX":
                if (!("object" == typeof t && "description"in t && "value"in t))
                    throw new Error("TXXX frame value should be an object with keys description and value");
                this._setUserStringFrame(t.description, t.value);
                break;
            case "TKEY":
                if (!/^([A-G][#b]?m?|o)$/.test(t))
                    throw new Error(e + " frame value should be like Dbm, C#, B or o");
                this._setStringFrame(e, t);
                break;
            case "WCOM":
            case "WCOP":
            case "WOAF":
            case "WOAR":
            case "WOAS":
            case "WORS":
            case "WPAY":
            case "WPUB":
                this._setUrlLinkFrame(e, t);
                break;
            case "COMM":
                if (!("object" == typeof t && "description"in t && "text"in t))
                    throw new Error("COMM frame value should be an object with keys description and text");
                this._setCommentFrame(t.description, t.text);
                break;
            default:
                throw new Error("Unsupported frame " + e)
            }
            return this
        }
        ,
        t.prototype.removeTag = function() {
            if (!(this.arrayBuffer.byteLength < 10)) {
                var e = new Uint8Array(this.arrayBuffer)
                  , t = e[3]
                  , r = c([e[6], e[7], e[8], e[9]]) + 10;
                !a(e) || t < 2 || t > 4 || (this.arrayBuffer = new Uint8Array(e.subarray(r)).buffer)
            }
        }
        ,
        t.prototype.addTag = function() {
            this.removeTag();
            var e = [255, 254]
              , t = [101, 110, 103]
              , a = 10 + this.frames.reduce(function(e, t) {
                return e + t.size
            }, 0) + this.padding
              , i = new ArrayBuffer(this.arrayBuffer.byteLength + a)
              , c = new Uint8Array(i)
              , u = 0
              , f = [];
            return f = [73, 68, 51, 3],
            c.set(f, u),
            u += f.length,
            u++,
            u++,
            f = o(a - 10),
            c.set(f, u),
            u += f.length,
            this.frames.forEach(function(a) {
                switch (f = r(a.name),
                c.set(f, u),
                u += f.length,
                f = s(a.size - 10),
                c.set(f, u),
                u += f.length,
                u += 2,
                a.name) {
                case "WCOM":
                case "WCOP":
                case "WOAF":
                case "WOAR":
                case "WOAS":
                case "WORS":
                case "WPAY":
                case "WPUB":
                    f = r(a.value),
                    c.set(f, u),
                    u += f.length;
                    break;
                case "TPE1":
                case "TCOM":
                case "TCON":
                case "TIT2":
                case "TALB":
                case "TPE2":
                case "TPE3":
                case "TPE4":
                case "TRCK":
                case "TPOS":
                case "TKEY":
                case "TMED":
                case "TPUB":
                    f = [1].concat(e),
                    c.set(f, u),
                    u += f.length,
                    f = n(a.value),
                    c.set(f, u),
                    u += f.length;
                    break;
                case "TXXX":
                case "USLT":
                case "COMM":
                    f = [1],
                    "USLT" !== a.name && "COMM" !== a.name || (f = f.concat(t)),
                    f = f.concat(e),
                    c.set(f, u),
                    u += f.length,
                    f = n(a.description),
                    c.set(f, u),
                    u += f.length,
                    f = [0, 0].concat(e),
                    c.set(f, u),
                    u += f.length,
                    f = n(a.value),
                    c.set(f, u),
                    u += f.length;
                    break;
                case "TBPM":
                case "TLEN":
                case "TYER":
                    u++,
                    f = r(a.value),
                    c.set(f, u),
                    u += f.length;
                    break;
                case "APIC":
                    f = [a.useUnicodeEncoding ? 1 : 0],
                    c.set(f, u),
                    u += f.length,
                    f = r(a.mimeType),
                    c.set(f, u),
                    u += f.length,
                    f = [0, a.pictureType],
                    c.set(f, u),
                    u += f.length,
                    a.useUnicodeEncoding ? (f = [].concat(e),
                    c.set(f, u),
                    u += f.length,
                    f = n(a.description),
                    c.set(f, u),
                    u += f.length,
                    u += 2) : (f = r(a.description),
                    c.set(f, u),
                    u += f.length,
                    u++),
                    c.set(new Uint8Array(a.value), u),
                    u += a.value.byteLength
                }
            }),
            u += this.padding,
            c.set(new Uint8Array(this.arrayBuffer), u),
            this.arrayBuffer = i,
            i
        }
        ,
        t.prototype.getBlob = function() {
            return new Blob([this.arrayBuffer],{
                type: "audio/mpeg"
            })
        }
        ,
        t.prototype.getURL = function() {
            return this.url || (this.url = URL.createObjectURL(this.getBlob())),
            this.url
        }
        ,
        t.prototype.revokeURL = function() {
            URL.revokeObjectURL(this.url)
        }
        ,
        t
    }()
});
