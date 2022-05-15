package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	log "github.com/sirupsen/logrus"
)

type Resp struct {
	Code int         `json:"code"`
	Data interface{} `json:"data"`
	Msg  string      `json:"msg"`
}

// ListUserBorrow 查看用户的借阅记录
func ListUserBorrow(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	user := r.FormValue("user")
	data, err := DBListUser(user)
	log.Debugf("data %v", data)
	if err != nil {
		ReturnError(err, w, r)
	}
	ReturnData(data, w, r)
}

// AddUserBorrow 添加一条借阅记录
func AddUserBorrow(w http.ResponseWriter, r *http.Request) {
	bytes, err := ioutil.ReadAll(r.Body)
	log.Debugf("ub is:", string(bytes))
	if err != nil {
		ReturnError(err, w, r)
	}
	defer r.Body.Close()
	var ub UserBorrow
	err = json.Unmarshal(bytes, &ub)
	if err != nil {
		ReturnError(err, w, r)
	}
	log.Debugf("ub is:", string(bytes))
	err = DBAddUserBorrow(ub)
	if err != nil {
		ReturnError(err, w, r)
	}
	ReturnSuccess(w, r)
}

func cors(f http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")                                                            // 允许访问所有域，可以换成具体url，注意仅具体url才能带cookie信息
		w.Header().Add("Access-Control-Allow-Headers", "Content-Type,AccessToken,X-CSRF-Token, Authorization, Token") //header的类型
		w.Header().Add("Access-Control-Allow-Credentials", "true")                                                    //设置为true，允许ajax异步请求带cookie信息
		w.Header().Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")                             //允许请求方法
		w.Header().Set("content-type", "application/json;charset=UTF-8")                                              //返回数据格式是json
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		f(w, r)
	}
}

func ReturnData(v interface{}, w http.ResponseWriter, r *http.Request) {
	resp := Resp{Code: 0, Data: v, Msg: "ok"}
	bytes, err := json.Marshal(resp)
	if err != nil {
		panic(err)
	}
	w.Write(bytes)
}

func ReturnError(err error, w http.ResponseWriter, r *http.Request) {
	resp := Resp{Code: -1, Msg: err.Error()}
	bytes, err := json.Marshal(resp)
	if err != nil {
		panic(err)
	}
	w.Write(bytes)
}

func ReturnSuccess(w http.ResponseWriter, r *http.Request) {
	resp := Resp{Code: 0, Msg: "ok"}
	bytes, err := json.Marshal(resp)
	if err != nil {
		panic(err)
	}
	w.Write(bytes)
}
