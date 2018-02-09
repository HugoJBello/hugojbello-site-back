var server   = require('../server'),
    chai     = require('chai'),
    chaiHTTP = require('chai-http'),
    should   = chai.should();

chai.use(chaiHTTP);

reqServer = process.env.HTTP_TEST_SERVER || server

describe('Basic routes tests', function() {

    it('GET to /pagecount should return 200', function(done){
        chai.request(reqServer)
        .get('/pagecount')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        })

    })
    /*
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
            'entry_name':'test_entry',
            'title':'title test entry',
            'content':'test content',
            'categoriesSemicolom':'cat_test1;cat_test2',
            'new':true} 
        )
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        })
    })

    
})


