var logpbk = function(str) {
    let strtolog = '[PB] function call to:';
    //strs.forEach(element => {
        //strtolog.concat(' ', element);
    //});

    //if (env === 'development')
        console.log(strtolog.concat(' ', str));
};

module.exports = logpbk;