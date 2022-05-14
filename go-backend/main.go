package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"time"

	log "github.com/sirupsen/logrus"
)

func main() {
	log.SetOutput(os.Stdout)
	log.SetLevel(log.DebugLevel)

	http.HandleFunc("/stu-mgr/list_user_borrow", ListUserBorrow)
	http.HandleFunc("/stu-mgr/add_user_borrow", AddUserBorrow)

	server := http.Server{Addr: ":80"}
	go func() {
		if err := server.ListenAndServe(); err != nil {
			log.Println("server start failed")
		}
	}()
	log.Debug("Server started")

	readyToStop(&server)
}

func readyToStop(server *http.Server) {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	s := <-c
	log.Printf("receive signal: %s\n", s)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Println("server shutdown failed")
	}
	log.Println("server exit")
}
