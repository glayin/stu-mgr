package main

import (
	"context"
	log "github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"testing"
)

func TestDB_ListUser(t *testing.T) {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://1.117.67.66:27017"))
	if err != nil {
		log.Panic(err)
	}
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			log.Panic(err)
		}
	}()

	coll := client.Database("book-mgr").Collection("user_borrow")
	cur, err := coll.Find(
		context.TODO(),
		bson.D{},
	)
	if err != nil {
		t.Fatal(err)
	}
	for cur.Next(context.TODO()) {
		var result UserBorrow
		if err := cur.Decode(&result); err != nil {
			log.Fatal(err)
		}
		t.Log("res:", result)
	}
}
