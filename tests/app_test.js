var server   = require('../server'),
    chai     = require('chai'),
    chaiHTTP = require('chai-http'),
    should   = chai.should();

chai.use(chaiHTTP);

reqServer = process.env.HTTP_TEST_SERVER || server

describe('Basic routes tests', function() {
    var loremIpsum= "# Section 1 \n Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor __incididunt__ \n ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu \n## Subsection \n fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum \n# Section 2 \n Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

    it('GET to /pagecount should return 200', function(done){
        chai.request(reqServer)
        .get('/pagecount')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        })

    })
    
    it('GET to /entry_view should return 200', function(done){
        chai.request(reqServer)
        .get('/entries/entry_view/test')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        })
    })
    

    it('Post to /entry_editor should return 200', function(done){
        chai.request(reqServer)
        .post('/editor/entry_editor')
        .send(
            {//'_id': 'test_entry',
            'entry_name':'test_entry4',
            'title':'title test entry4',
            'content':loremIpsum,
            'categoriesSemicolom':'cat_test1;cat_test2',
            'new':'false'} 
        )
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        })
    })

    var image = "+MZScHeJQ9Cz5dfxnEmIMHWMZyZYnYx8Rrhj0HbtfGUanv5w3UHUyADbiGsKJxeM1yV4uGwBS7cYlAec1w0AX6xg2A1O854UF8OS6PAP1MtzkeFnrNlD41U8XFeGrp1fn3jRMUs8sqS61umSS2rR2NDhppjZ4OvnOWBAq6X+sQNkhKkfZOdYsZOpz8fWIQb6wQ/GchVCgfZko4PMDg1DSumausG6o+2E6wKLLjKReUaHEQXKJV8h85XEKN4p/WEBvTHmmJ/IN178YJVgrGmfOScAuBPp+sggGA7/wC1kgbDiacbGABOcCLHVRpMuBQh5Xn4xqARF03pwkJT23LhxGLiSGp8mCVWDrzPf3iwp4C3nDSg2VUfNwgDvm6vrIiFJvp8ZHIdjoFx8BX0OH0+8TVii3GAKKc2kjz7dYqUCdsuMOm2hrr+h//Z";

    it('Post to /upload should return 200', function(done){
        chai.request(reqServer)
        .post('/files/upload')
        .send(
            {'filename':'test_im',
            'base64':image} 
        )
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        })
    })
})


