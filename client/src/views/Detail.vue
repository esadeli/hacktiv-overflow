<template>
<div class="container">
        <div class="col-md-15 box">
            <div class="details">
                <h1>Cerita lengkap</h1>
                    <div class="lead">
                        <h4><span class="badge badge-light">{{ articledata.title }}</span></h4>
                        <br/>
                        <div class="row" v-if= "token !== ''">
                          <div class="col-md-2">
                              <div v-if= "articledata.userId !== userid ">
                                <button type="button" class="btn btn-success" v-on:click= "upvotearticle()">Upvote</button>
                              </div>
                              <div v-else-if= "articledata.userId === userid ">
                                <button type="button" class="btn btn-info" >Upvote</button>
                              </div>
                               {{ articledata.upVotesList.length }}
                            </div>
                            <div class="col-md-3">
                              <div v-if= "articledata.userId !== userid ">
                                <button type="button" class="btn btn-danger" v-on:click= "downvotearticle()">Downvote</button>
                              </div>
                              <div v-else-if= "articledata.userId === userid ">
                                <button type="button" class="btn btn-info" >Downvote</button>
                              </div>
                              {{ articledata.downVotesList.length }}
                            </div>
                        </div>
                        <div class=row v-if= "token !== '' && articledata.userId === userid">
                            <hr/>
                            <div class="col-md-9"></div>
                            <div class="col-md-1">
                                <button type="button" class="btn btn-warning">
                                  <router-link :to="{ name: 'editarticle', params: { id: articledata._id }}">
                                    <font style="color: white">Edit</font>
                                  </router-link>
                                </button>
                            </div>
                            <div class="col-md-2">
                               <button type="button" class="btn btn-danger" v-on:click= "deletearticle()">Delete</button>
                            </div>
                            <hr/>
                        </div>
                    </div>
                <br/>
                <span class="badge badge-light">Description :</span>
                <br/>
                <h5>{{ articledata.description }}</h5>
                <br/>
                <br/>
                <h3>
                  <span class="badge badge-secondary">Answer Section: </span>
                </h3>
                <hr>
                <div v-if= "commentslist.length !== 0">
                  <ul class="list-group" >
                     <li class="list-group-item" v-for="(comment,index) in commentslist" :key="index">
                        <div v-if = "comment._id != editcommentid && editcommentstatus === false">
                            <div class="row">
                              <div class="col-md-2">
                                <span class="badge badge-secondary">{{ comment.userfullname }} </span>
                              </div>
                              <div class="col-md-3">
                                <div v-if= "token !== '' " >
                                  <div v-if= "comment.userIdComment === userid && token !== ''" >
                                    <span class="badge badge-info">Upvote:</span>
                                  </div>
                                  <div v-else-if= "comment.userIdComment !== userid && token !== ''">
                                    <button type="button" class="btn btn-success" v-on:click= "upvotecomment(comment._id)">Upvote</button>
                                  </div>
                                  {{ comment.commentUpVotes.length }}
                                </div>
                                <div v-if= "token !== '' ">
                                    <div v-if= "articledata.userId === userid ">
                                      <span class="badge badge-info">Downvote:</span>
                                    </div>
                                    <div v-else-if= "comment.userIdComment !== userid ">
                                      <button type="button" class="btn btn-danger" v-on:click= "downvotecomment(comment._id)">Downvote</button>
                                    </div>
                                    {{ comment.commentDownVotes.length }}
                                </div>
                              </div>
                              <div class="col-md-4">
                                  {{ comment.content }}
                              </div>
                              <div class="col-md-1">
                                <div v-if= "comment.userIdComment == userid && token !== '' && editcommentstatus === false ">
                                  <button type="button" class="btn btn-warning" v-on:click= "changeeditcommentstatus(comment._id, comment.content)">Edit Comment</button>
                                </div>
                              </div>
                            </div>
                        </div>
                        <div v-else-if= "comment.userIdComment == userid && token !== '' && comment._id == editcommentid && editcommentstatus === true">
                           <div class= "row">
                              <div class="col-md-2">
                                <span class="badge badge-secondary">{{ comment.userfullname }} </span>
                              </div>
                              <div class= "col-md-10">
                                <form>
                                   <div class="form-group">
                                      <label for="exampleInputEmail1">Topic</label>
                                      <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model= "editcommentcontent" placeholder="Answer">
                                  </div>
                                  <button type="button" class="btn btn-primary" v-on:click= "editcomment(comment._id)">Edit Answer</button>
                                </form>
                              </div>
                           </div>
                        </div>
                     </li>
                  </ul>
                </div>
                <div v-else>
                   <p>No answers available</p>
                </div>
                <hr>
                <div v-if= "token !== '' && userid !== '' && editcommentstatus === false">
                   <h4>Answers</h4>
                    <form>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Answer</label>
                            <textarea class="form-control" rows="5" id="comment" placeholder="give him/her a clue" v-model= "newcomment"></textarea>
                        </div>
                        <button type="button" class="btn btn-primary" v-on:click= "addcomment()">Save</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Detail',
  props: ['id', 'token', 'userid'],
  data () {
    return {
      articleid: '',
      articledata: {},
      commentslist: [],
      newcomment: '',
      editcommentstatus: false,
      editcommentid: '',
      editcommentcontent: '',
      upvotearticleid: '',
      downvotearticleid: '',
      upvotecommentid: '',
      downvotecommentid: ''
    }
  },
  methods: {
    // delete individual article
    deletearticle () {
      // Note: it's not necessary to put this validation since we have hide the button
      // yet double validation is better
      if (this.articledata.userId === this.userid) {
        let self = this
        axios({
          method: 'delete',
          url: `http://35.197.145.160//articles/delete/${self.id}`,
          headers: {
            token: self.token
          }
        })
          .then(article => {
            this.$router.push({ path: '/articles' })
          })
          .catch(error => {
            console.log('ERROR: ', error)
          })
      }
    },

    // add new comment
    addcomment () {
      let self = this
      axios({
        method: 'POST',
        url: `http://35.197.145.160/comments`,
        headers: {
          token: self.token
        },
        data: {
          content: self.newcomment,
          articleId: self.id
        }
      })
        .then(comment => {
          // get the updated comment
          axios({
            method: 'GET',
            url: `http://35.197.145.160/articles/details/${self.id}`
          })
            .then(articles => {
              self.commentslist = articles.data.data.commentsList
              self.newcomment = ''
              this.$router.push({ path: `/articles/${self.id}` })
            })
            .catch(error => {
              console.log('ERROR: ', error)
            })
        })
        .catch(error => {
          console.log('ERROR: ', error)
        })
    },

    // edit comment status
    changeeditcommentstatus (id, content) {
      this.editcommentid = id
      this.editcommentcontent = content
      this.editcommentstatus = true
    },

    // edit comment
    editcomment (input) {
      let commentId = input
      let self = this
      axios({
        method: 'PUT',
        url: `http://35.197.145.160/comments/edit/${commentId}`,
        headers: {
          token: self.token
        },
        data: {
          content: self.editcommentcontent
        }
      })
        .then(comment => {
          // get the updated comment
          axios({
            method: 'GET',
            url: `http://35.197.145.160/articles/details/${self.id}`
          })
            .then(articles => {
              self.commentslist = articles.data.data.commentsList
              // reset edit comment parameter
              self.editcommentid = ''
              self.editcommentcontent = ''
              self.editcommentstatus = false
              // revert back to detail article view
              this.$router.push({ path: `/articles/${self.id}` })
            })
            .catch(error => {
              console.log('ERROR: ', error)
            })
        })
        .catch(error => {
          console.log('ERROR: ', error)
        })
    },
    // upvote article
    upvotearticle () {
      this.upvotearticleid = this.userid
      let self = this
      axios({
        method: 'POST',
        url: `http://35.197.145.160/articles/details/${self.id}/upvote`,
        headers: {
          token: self.token
        }
      })
        .then(upvote => {
          // get the updated article
          axios({
            method: 'GET',
            url: `http://35.197.145.160/articles/details/${self.id}`
          })
            .then(articles => {
              self.articledata = articles.data.data
              self.upvotearticleid = ''
              self.commentslist = articles.data.data.commentsList
              self.newcomment = ''
              this.$router.push({ path: `/articles/${self.id}` })
            })
            .catch(error => {
              console.log('ERROR: ', error)
            })
        })
        .catch(error => {
          console.log('ERROR: ', error)
        })
    },

    // downvote article
    downvotearticle () {
      this.downvotearticleid = this.userid
      let self = this
      axios({
        method: 'POST',
        url: `http://35.197.145.160/articles/details/${self.id}/downvote`,
        headers: {
          token: self.token
        }
      })
        .then(downvote => {
          // get the updated article
          axios({
            method: 'GET',
            url: `http://35.197.145.160/articles/details/${self.id}`
          })
            .then(articles => {
              self.articledata = articles.data.data
              self.downvotearticleid = ''
              self.commentslist = articles.data.data.commentsList
              self.newcomment = ''
              this.$router.push({ path: `/articles/${self.id}` })
            })
            .catch(error => {
              console.log('ERROR: ', error)
            })
        })
        .catch(error => {
          console.log('ERROR: ', error)
        })
    },

    // upvote comment
    upvotecomment (input) {
      this.upvotecommentid = input
      let self = this
      axios({
        method: 'POST',
        url: `http://35.197.145.160/comments/upvote/${self.upvotecommentid}`,
        headers: {
          token: self.token
        }
      })
        .then(downvote => {
          // get the updated article
          axios({
            method: 'GET',
            url: `http://35.197.145.160/articles/details/${self.id}`
          })
            .then(articles => {
              self.articledata = articles.data.data
              self.upvotecommentid = ''
              self.commentslist = articles.data.data.commentsList
              self.newcomment = ''
              this.$router.push({ path: `/articles/${self.id}` })
            })
            .catch(error => {
              console.log('ERROR: ', error)
            })
        })
        .catch(error => {
          console.log('ERROR: ', error)
        })
    },

    // downvote comment
    downvotecomment (input) {
      this.downvotecommentid = input
      let self = this
      axios({
        method: 'POST',
        url: `http://35.197.145.160/comments/downvote/${self.downvotecommentid}`,
        headers: {
          token: self.token
        }
      })
        .then(downvote => {
          // get the updated article
          axios({
            method: 'GET',
            url: `http://35.197.145.160/articles/details/${self.id}`
          })
            .then(articles => {
              self.articledata = articles.data.data
              self.upvotecommentid = ''
              self.commentslist = articles.data.data.commentsList
              self.newcomment = ''
              this.$router.push({ path: `/articles/${self.id}` })
            })
            .catch(error => {
              console.log('ERROR: ', error)
            })
        })
        .catch(error => {
          console.log('ERROR: ', error)
        })
    }
  },
  created () { // purposefully added to handle first time detail clicked
    // get data
    let self = this
    axios({
      method: 'GET',
      url: `http://35.197.145.160/articles/details/${self.id}`
    })
      .then(result => {
        self.articledata = result.data.data
        self.commentslist = result.data.data.commentsList
      })
      .catch(error => {
        console.log('ERROR: ', error)
      })
  },
  watch: {
    id: function (val) {
      this.articleid = val

      // get data
      let self = this
      axios({
        method: 'GET',
        url: `http://35.197.145.160/articles/details/${this.articleid}`
      })
        .then(result => {
          self.articledata = result.data.data
          self.commentslist = result.data.data.commentsList
        })
        .catch(error => {
          console.log('ERROR: ', error)
        })
    }
  }
}
</script>

<style>
* {
    padding: 0;
    margin: 0;
    font-family: Quicksand, Arvo, Amiri,Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

body {
    padding-top: 65px;
  }

.navbar-right p {
float: right;
line-height: 50px;
color: white;
margin-left: 10px;
margin-bottom: 0px;
}

.row {
    display: flex;
}

.row > div {
flex: 1;
/* border: 1px solid grey; */
margin-top:10px;
}

.row-body {
height: 100vw;
}

.row-body .box {
border-right: 1px solid #eee;
}

.row-body div:last-child {
border-right: none;
}

input.search {
    margin-bottom: 10px;
}

.divScroll {
    height: 300px;
    overflow-y:scroll;
    overflow-x:hidden;
    width: 50%;
}

.divScrollDetails {
    height: 500px;
    overflow-y:scroll;
    overflow-x:hidden;
}

.details {
    background: rgb(155, 223, 181);
    width: 800px;
    border-radius: 10px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
</style>
