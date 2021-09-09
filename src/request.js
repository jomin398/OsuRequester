const DB = {};
//Localiztion
function loadXhr(p, cbf, b) {
    let xhr = new XMLHttpRequest();
    if (!cbf) {
        throw 'Call Back Function is Undefined';
    }
    xhr.open('GET', p, true);
    xhr.onload = () => cbf(xhr.responseText);
    if (b) {
        xhr.send(b);
    } else {
        xhr.send();
    }

}

/**
 * @author jomin398
 * @name displayJSON
 * @param {object} obj to display json object 
 * @param {object} option to set options @see guide https://github.com/abodelot/jquery.json-viewer
 */
function displayJSON(obj, option) {
    let el1 = document.getElementById('json-rendrer');
    if (!el1) {
        jsonWrapper = document.createElement('div');
        jsonWrapper.id = 'jsonWrapper';
        el1 = document.createElement('label');
        el1.innerText = 'JSON viewer';
        el2 = document.createElement('a');
        el2.id = 'json-rendrer';
        el2.innerText = 'Init json...';
        jsonWrapper.append(el1, document.createElement('br'), el2);
        document.body.appendChild(jsonWrapper);
    }
    if (obj) {
        $(function () {
            $('#json-rendrer').jsonViewer(obj, option);
        });
    }

}
function displayInfo(str) {
    let ele = document.getElementById('displayInfo');
    if (!ele) {
        ele = document.createElement('div');
        ele.id = 'displayInfo';
        ele.innerText = '[to Show String Here]';
        document.body.appendChild(ele)
    }
    if (str) {
        ele.innerText = Array.isArray(str) ? str.join('\n') : typeof str == 'object' ? JSON.stringify(str) : str;
        console.log(str)
    }
}
function blink(targetElem, showMsg) {
    targetElem.classList.add("blink");
    if (showMsg) {
        displayInfo(showMsg);
    }
    setTimeout(() => {
        targetElem.classList.remove('blink');
        if (document.getElementById('displayInfo')) {
            document.getElementById('displayInfo').remove();
        }
    }, 2000);
}