var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Property = (function (_super) {
    __extends(Property, _super);
    function Property() {
        _super.apply(this, arguments);
    }
    return Property;
})(T);
exports.Property = Property;

var Channel = (function () {
    function Channel() {
    }
    return Channel;
})();
exports.Channel = Channel;

var Root = (function () {
    function Root() {
    }
    return Root;
})();
exports.Root = Root;

var Comment = (function () {
    function Comment() {
    }
    Object.defineProperty(Comment.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (val) {
            this._text = val.clone();
            this._text.uptodate = false;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Comment.prototype, "author", {
        get: function () {
            return this._author;
        },
        set: function (val) {
            this._author = val.clone();
            this._author.uptodate = false;
        },
        enumerable: true,
        configurable: true
    });

    return Comment;
})();
exports.Comment = Comment;
