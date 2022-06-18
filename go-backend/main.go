package main

import (
	"context"
	"github.com/herrhu97/simple-go-framework/log"
	"net/http"
	"os"
	"os/signal"
	"time"
)

var logger *log.Logger

func main() {

	go periodRefreshDB()

	logger = log.New()

	http.HandleFunc("/stu-mgr/list_user_borrow", cors(ListUserBorrow))
	http.HandleFunc("/stu-mgr/add_user_borrow", cors(AddUserBorrow))

	server := http.Server{Addr: ":80"}
	go func() {
		if err := server.ListenAndServe(); err != nil {
			logger.Debug("server start failed")
		}
	}()
	logger.Debug("Server started")
	readyToStop(&server)
}

func readyToStop(server *http.Server) {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	s := <-c
	logger.Debug("receive signal: %s\n", s)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		logger.Debug("server shutdown failed")
	}
	logger.Debug("server exit")
}

func periodRefreshDB() {
	for {
		log.Debug("Begin to Refresh")
		err := RefreshOverDue()
		if err != nil {
			log.Error(err)
		}
		time.Sleep(time.Minute * 5)
	}
}
