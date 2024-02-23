module.exports = {
        apps:[
                {
                        name:'Conative Live BE',
                        script:'node',
                        args:'index.js',
                        env:{
                                NODE_ENV:'production'
                        },
                        watch:false,
                },
        ],
}

