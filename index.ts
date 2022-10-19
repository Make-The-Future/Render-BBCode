import * as _ from 'lodash';
import BBCodeHTML from './BBCodeHTML';
import './scss/main.scss'
(function (BBCodeHTML) {
    const bbcodeParser = new BBCodeHTML();
    const App = document.querySelectorAll('[MTFBBCode]');
    for (var i = 0; i < App.length; i++) {
        App[i].innerHTML = bbcodeParser.bbcodeToHtml(App[i].textContent)
    }
})(BBCodeHTML)
