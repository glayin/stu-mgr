package main

import (
	"encoding/json"
	log "github.com/sirupsen/logrus"
	"io/ioutil"
	"net/http"
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
	if err != nil {
		ReturnError(err, w, r)
	}
	defer r.Body.Close()
	var ub UserBorrow
	err = json.Unmarshal(bytes, &ub)
	if err != nil {
		ReturnError(err, w, r)
	}
	err = DBAddUserBorrow(ub)
	if err != nil {
		ReturnError(err, w, r)
	}
	ReturnSuccess(w, r)
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
