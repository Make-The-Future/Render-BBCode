class BBCodeHTML {
    greeting: string;
    tokens: any = [];
    bbcode_matches: any = [];
    html_tpls: any = [];
    html_matches: any = [];
    bbcode_tpls: any = [];
    token_match = /{[A-Z_]+[0-9]*}/ig;
    constructor() {
        this.tokens = {
            'URL': '((?:(?:[a-z][a-z\\d+\\-.]*:\\/{2}(?:(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})+|[0-9.]+|\\[[a-z0-9.]+:[a-z0-9.]+:[a-z0-9.:]+\\])(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})*)*(?:\\?(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?(?:#(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?)|(?:www\\.(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})+(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})*)*(?:\\?(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?(?:#(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?)))',
            'LINK': '([a-z0-9\-\./]+[^"\' ]*)',
            'EMAIL': '((?:[\\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*(?:[\\w\!\#$\%\'\*\+\-\/\=\?\^\`{\|\}\~]|&)+@(?:(?:(?:(?:(?:[a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(?:\\d{1,3}\.){3}\\d{1,3}(?:\:\\d{1,5})?))',
            'TEXT': '(.*?)',
            'SIMPLETEXT': '([a-zA-Z0-9-+.,_ ]+)',
            'INTTEXT': '([a-zA-Z0-9-+,_. ]+)',
            'IDENTIFIER': '([a-zA-Z0-9-_]+)',
            'COLOR': '([a-z]+|#[0-9abcdef]+)',
            'NUMBER': '([0-9]+)'
        };
        this.addDefault();
    }
    addDefault = () => {
        this.addBBCode('[@MCode="{TEXT}"]', '<iframe allowfullscreen="true" allowtransparency="true" frameborder="no" height="500" scrolling="no" src="https://code.mtf.in.th/view/{TEXT}" style="width: 100%;" title="Code MTF.IN.TH" />');
        this.addBBCode('[youtube="{TEXT}"]', '<iframe width="100%" height="500" src="https://www.youtube.com/embed/{URL}" title="Youtube play" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />');
        this.addBBCode('[youtube="{TEXT}" autoplay]', '<iframe width="100%" height="500" src="https://www.youtube.com/embed/{URL}?&autoplay=1" title="Youtube play" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen />');
    
        this.addBBCode('[b]{TEXT}[/b]', '<strong>{TEXT}</strong>');
        this.addBBCode('[i]{TEXT}[/i]', '<em>{TEXT}</em>');
        this.addBBCode('[u]{TEXT}[/u]', '<span style="text-decoration:underline;">{TEXT}</span>');
        this.addBBCode('[s]{TEXT}[/s]', '<span style="text-decoration:line-through;">{TEXT}</span>');
        this.addBBCode('[url={URL}]{TEXT}[/url]', '<a href="{URL}" title="link" target="_blank">{TEXT}</a>');
        this.addBBCode('[url]{URL}[/url]', '<a href="{URL}" title="link" target="_blank">{URL}</a>');
        this.addBBCode('[url={LINK}]{TEXT}[/url]', '<a href="{LINK}" title="link" target="_blank">{TEXT}</a>');
        this.addBBCode('[url]{LINK}[/url]', '<a href="{LINK}" title="link" target="_blank">{LINK}</a>');
        this.addBBCode('[img={URL} width={NUMBER1} height={NUMBER2}]{TEXT}[/img]', '<img src="{URL}" width="{NUMBER1}" height="{NUMBER2}" alt="{TEXT}" />');
        this.addBBCode('[img]{URL}[/img]', '<img src="{URL}" alt="{URL}" />');
        this.addBBCode('[img={LINK} width={NUMBER1} height={NUMBER2}]{TEXT}[/img]', '<img src="{LINK}" width="{NUMBER1}" height="{NUMBER2}" alt="{TEXT}" />');
        this.addBBCode('[img]{LINK}[/img]', '<img src="{LINK}" alt="{LINK}" />');
        this.addBBCode('[img={TEXT} width={NUMBER1} height={NUMBER2}]{TEXT}[/img]', '<img src="{TEXT}" width="{NUMBER1}" height="{NUMBER2}" alt="{TEXT}" />');
        this.addBBCode('[img]{TEXT}[/img]', '<img src="{TEXT}" alt="{TEXT}" />');
        this.addBBCode('[color=COLOR]{TEXT}[/color]', '<span style="{COLOR}">{TEXT}</span>');
        this.addBBCode('[highlight={COLOR}]{TEXT}[/highlight]', '<span style="background-color:{COLOR}">{TEXT}</span>');
        this.addBBCode('[quote="{TEXT1}"]{TEXT2}[/quote]', '<div class="quote"><cite>{TEXT1}</cite><p>{TEXT2}</p></div>');
        this.addBBCode('[quote]{TEXT}[/quote]', '<cite>{TEXT}</cite>');
        this.addBBCode('[blockquote]{TEXT}[/blockquote]', '<blockquote>{TEXT}</blockquote>');
    }
    _getRegEx = (str: string) => {
        var matches = str.match(this.token_match);
        var nrmatches = matches.length;
        var i = 0;
        var replacement = '';

        if (nrmatches <= 0) {
            return new RegExp(this.preg_quote(str), 'g');        // no tokens so return the escaped string
        }

        for (; i < nrmatches; i += 1) {
            // Remove {, } and numbers from the token so it can match the
            // keys in tokens
            var token = matches[i].replace(/[{}0-9]/g, '');

            if (this.tokens[token]) {
                // Escape everything before the token
                replacement += this.preg_quote(str.substr(0, str.indexOf(matches[i]))) + this.tokens[token];

                // Remove everything before the end of the token so it can be used
                // with the next token. Doing this so that parts can be escaped
                str = str.substr(str.indexOf(matches[i]) + matches[i].length);
            }
        }

        replacement += this.preg_quote(str);      // add whatever is left to the string

        return new RegExp(replacement, 'gi');
    }
    _getTpls = (str: string) => {
        var matches = str.match(this.token_match);
        var nrmatches = matches.length;
        var i = 0;
        var replacement = '';
        var positions : any = {};
        var next_position = 0;

        if (nrmatches <= 0) {
            return str;       // no tokens so return the string
        }

        for (; i < nrmatches; i += 1) {
            // Remove {, } and numbers from the token so it can match the
            // keys in tokens
            var token = matches[i].replace(/[{}0-9]/g, '');
            var position;

            // figure out what $# to use ($1, $2)
            if (positions[matches[i]]) {
                position = positions[matches[i]];         // if the token already has a position then use that
            } else {
                // token doesn't have a position so increment the next position
                // and record this token's position
                next_position += 1;
                position = next_position;
                positions[matches[i]] = position;
            }

            if (this.tokens[token]) {
                replacement += str.substr(0, str.indexOf(matches[i])) + '$' + position;
                str = str.substr(str.indexOf(matches[i]) + matches[i].length);
            }
        }

        replacement += str;

        return replacement;
    }

    preg_quote = (str: string, delimiter: string = "") => {
        return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
    }
    bbcodeToHtml = (str: string) => {
        var nrbbcmatches = this.bbcode_matches.length;
        var i = 0;
        for (; i < nrbbcmatches; i += 1) {
            str = str.replace(this.bbcode_matches[i], this.html_tpls[i]);
        }
        return str;
    }

    addBBCode = (bbcode_match: string, bbcode_tpl: string) => {
        this.bbcode_matches.push(this._getRegEx(bbcode_match));
        this.html_tpls.push(this._getTpls(bbcode_tpl));
        this.html_matches.push(this._getRegEx(bbcode_tpl));
        this.bbcode_tpls.push(this._getTpls(bbcode_match));
    }
}
export default BBCodeHTML;