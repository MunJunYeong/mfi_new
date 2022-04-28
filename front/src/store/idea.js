import axios from "axios";
const { VUE_APP_BACKEND_HOST } = process.env;
const ideaModule = {
    state: {
        clickIdeaData : {},
        commentData : [],
        successModify : false,
        ideas : [],
        totalPages : {},
        totalItems : {},
    },
    mutations: {
        idea_set_data (state, ideaData) {
            state.ideas = ideaData.ideas;
            state.totalPages = ideaData.totalPages;
            state.totalItems = ideaData.totalItems;
        },
        click_idea_set_data(state, ideaData){
            state.clickIdeaData = {...ideaData[0]};
        },
        click_comment_set_data(state, commentData){
            state.commentData = [];
            state.commentData.push(commentData);
        },
        change_modify_flag(state, success){
            state.successModify = success;
        }
    },
    getters: {
        idea_get_item(state){
            return state.ideas;
        },
        idea_get_total_pages(state){
            return state.totalPages;
        },
        idea_get_total_items(state){
            return state.totalItems;
        },
        click_idea_get_data(state){
            return state.clickIdeaData;
        },
        comment_get_data(state){
            return state.commentData[0];
        },
        modify_get_flage(state){
            return state.successModify
        }
    },
    actions: {
        //전체 아이디어 보여줄 때
        async show_idea({commit}, data){
            let res;
            let baseUrl = VUE_APP_BACKEND_HOST +'/idea?page='+data.page;
            if(data.subject) {
                baseUrl += `&subject=${data.subject}`
            }
            try{
                res = await axios.get( baseUrl , {
                    params: {
                        role : data.role,
                        order : data.order,
                        userIdx : data.userData.userIdx,
                        userRole : data.userData.role,
                    }
                });
            }catch(err){
                console.log(err);
                return;
            }
            if(res.data.message){
                alert('시스템 오류가 발생했습니다. 잠시 후 시도해주세요.'); 
                location.href='/home'; //새로고침
                return;
            }
            commit('idea_set_data', res.data);
            return;
        },
        //내가 쓴 아이디어 보여주기
        async show_my_idea({commit}, data){
            let token = localStorage.getItem('accessToken');

            let res;
            let where = `page=${data.page}&userIdx=${data.userIdx}`
            if(data.subject !== ''){
                where += `&subject=${data.subject}`
            }
            try{
                res = await axios.get(VUE_APP_BACKEND_HOST +`/info/idea?${where}`,{
                    headers : {
                        'Authorization' : token
                    }
                });
            }catch(err){
                console.log(err);
                return;
            }

            if(res.data.message){
                console.log(res.data.message)
                let message = res.data.message;
                if(message === 'force logout'){
                    alert('다른 기기에서 로그인하여 로그아웃 되었습니다. 재 로그인 해주세요.')
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    location.href='/home'; //새로고침
                    return;
                }else{
                    alert(message); return;
                }
            }else {
                commit('idea_set_data', res.data);
                return;
            }
        },
        async show_admin_user_idea({commit}, data){
            let token = localStorage.getItem('accessToken');
            let res;
            let where = `page=${data.page}`
            if(data.subject !== undefined){
                where += `&subject=${data.subject}`
            }
            try{
                res = await axios.get(VUE_APP_BACKEND_HOST +`/user/${data.userIdx}/idea?${where}`,{
                    headers : {
                        'Authorization' : token
                    }
                });
            }catch(err){
                console.log(err);
                return;
            }
            if(res.data.message){
                alert('시스템 오류가 발생했습니다. 잠시 후 시도해주세요.'); 
                location.href='/home'; //새로고침
                return;
            }
            commit('idea_set_data', res.data);
            return;
        },
        //아이디어 클릭했을 때
        async click_idea({commit}, data) {
            let token = localStorage.getItem('accessToken');
            let res;
            try {
                res = await axios.get(VUE_APP_BACKEND_HOST +`/idea/${data.ideaIdx}`, 
                {
                    headers : {
                        'Authorization' : token
                    }
                });
            }catch(err){
                console.log(err);
                return;
            }
            
            if(res.data.message){
                console.log(res.data.message)
                let message = res.data.message;
                if(message === 'force logout'){
                    alert('다른 기기에서 로그인하여 로그아웃 되었습니다. 재 로그인 해주세요.')
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    location.href='/home'; //새로고침
                }
            }else {
                commit('click_idea_set_data', res.data.data);
                return;
            }
        },        
        //아이디어 추가
        async add_idea({commit}, data){
            let token = localStorage.getItem('accessToken');
            let res;
            if(!data.subject) {
                alert('제목을 입력해주세요.'); return;
            }
            if(!data.content){
                alert('내용을 입력해주세요.'); return;
            }
            try {
                res = await axios.post(VUE_APP_BACKEND_HOST +'/idea',{
                    subject : data.subject,
                    content : data.content,
                },
                {
                    headers : {
                        'Authorization' : token
                    }
                });
            }catch(err){
                console.log(err)
            }
            commit
            if(res.data.message){
                alert(res.data.message); return;
            }else {
                alert("아이디어를 무사히 제출했습니다!");
                history.back();
            }
        },

        //아이디어 수정
        async modify_idea({commit}, ideaData){
            let res;
            let token = localStorage.getItem('accessToken');
            if(!ideaData.subject){
                alert('제목을 입력해주세요.');
                return;
            }
            if(!ideaData.content){
                alert('내용을 입력해주세요.');
                return;
            }
            try{
                res = await axios.put(VUE_APP_BACKEND_HOST +'/idea/:ideaIdx', 
                {
                    params : {
                        ideaIdx : ideaData.ideaIdx,
                        subject : ideaData.subject,
                        content : ideaData.content
                    }
                },
                {
                    headers : {
                        'Authorization' : token
                    }
                })
            }catch(err){
                alert('통신오류');
                return;
            }
            if(res.data.message){
                alert('시스템 오류가 발생했습니다. 잠시 후 시도해주세요.');
                location.href='/home'; //새로고침
                 return;
            }
            if(res.data.data[0] === 1){
                commit('change_modify_flag', true);
            }
        },
        async idea_comment({commit}, ideaIdx){
            let res;
            let token = localStorage.getItem('accessToken');
            try {
                res = await axios.get(VUE_APP_BACKEND_HOST +'/comment?ideaIdx='+ ideaIdx.ideaIdx, {
                    headers : {
                        'Authorization' : token
                    }
                });
                commit('click_comment_set_data', res.data.data);
                return;
            }catch(err){
                console.log(err)
                return;
            }
            
        },
        
        async delete_idea({commit}, ideaData){
            let res;
            let token = localStorage.getItem('accessToken');
            try{
                res = await axios.delete(VUE_APP_BACKEND_HOST +'/idea?ideaIdx='+ ideaData.ideaIdx,
                {
                    headers : {
                        'Authorization' : token
                    }
                });
                commit
                res
                return;
            }catch(err){
                console.log(err);
                return;
            }
        },
        async add_comment({commit}, commentData){
            let res;
            let token = localStorage.getItem('accessToken');
            if(!commentData.comment){
                alert('댓글을 입력해주세요.'); return;
            }
            commit
            try {
                res = await axios.post(VUE_APP_BACKEND_HOST +'/comment', 
                {
                    comment : commentData.comment,
                    ideaIdx : commentData.ideaIdx
                },
                {
                    headers : {
                        'Authorization' : token
                    }
                });
            }catch(err){
                console.log(err);
                return;
            }
            if(res.data.message){
                alert(res.data.message);
            }
            return;
        },
        
    }
}

  export default ideaModule