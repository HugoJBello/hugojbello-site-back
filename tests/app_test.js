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
            'new':'true'} 
        )
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        })
    })
})


