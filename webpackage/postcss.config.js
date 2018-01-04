module.exports = {
    plugins: [
        require('postcss-nested')(),
        require('postcss-cssnext')({warnForDuplicates: false})/*,
        require('cssnano')({zindex: false}),
        require('autoprefixer')({
            browsers: ['> 1%', 'last 5 versions', 'not ie <= 9'],
        })*/
    ]
}
