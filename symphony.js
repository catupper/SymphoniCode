function update_sco () {
    var sco = document.getElementById('source_code_orphan');
    sco.setAttribute('data-sourceCode', getSourceCode());
}

function sourceCodeSender () {   
    setInterval("window.update_sco()", 1000);
}

var sourceCodeOrphan = document.createElement('div');
sourceCodeOrphan.setAttribute('id', 'source_code_orphan');
sourceCodeOrphan.setAttribute('data-sourccCode', '');
(document.body || document.head || document.documentElement).appendChild(sourceCodeOrphan);


var script = document.createElement('script');
script.appendChild(document.createTextNode(update_sco + '\n('+ sourceCodeSender +')();'));
(document.body || document.head || document.documentElement).appendChild(script);

class codeSupervisor{
    constructor(){
        this.code = '';
        this.states = {};
        this.callback_funcs = [];
    }

    update(source_code){
        for(var f of this.callback_funcs){
            f(this.code, source_code, this.states);
        }
        this.code = source_code;
    }

    // void f(old_code, new_code, states);
    // must update states;
    //
    // void initilaiztation(states)
    // must update states;
    addCallbackFunc(f, initialization){
        if(initialization !== undefined)
            initialization(this.states);
        this.callback_funcs.push(f);
    }
}

var code_supervisor = new codeSupervisor();
code_supervisor.addCallbackFunc(
    function(old_code, new_code, states){
        var new_length = new_code.length;
        var old_length = states['length'];
        var last_add_or_delete = states['add_or_delete'];
        states['add_or_delete'] += Math.abs(new_length - old_length);
        states['length'] = new_length;
        if(Math.floor(states['add_or_delete'] / 5) - Math.floor(last_add_or_delete / 5)){
            console.log('Length: ' + new_length + '\nStrokes: ' + states['add_or_delete']);
        }
    },
    function(states){
        states['length'] = 0;
        states['add_or_delete'] = 0;
    }
);

var sco = document.getElementById('source_code_orphan');

function patrol(){
    code_supervisor.update(sco.dataset.sourcecode);
}

window.onload = function() {
    var code_supervisor = new codeSupervisor();
    setInterval("patrol()", 1000);
};

