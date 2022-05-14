package main

import (
	"context"
	log "github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var cli *mongo.Client

func init() {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://1.117.67.66:27017"))
	if err != nil {
		log.Panic(err)
	}
	cli = client
}

func DBListUser(name string) ([]UserBorrow, error) {

	coll := cli.Database("book-mgr").Collection("user_borrow")
	var cur *mongo.Cursor
	var err error
	if name == "" {
		cur, err = coll.Find(context.TODO(), bson.D{})
	} else {
		cur, err = coll.Find(context.TODO(), bson.M{"user": name})
	}
	log.Println("name:", name)
	var userBorrows []UserBorrow
	for cur.Next(context.TODO()) {
		var ub UserBorrow
		err = cur.Decode(&ub)
		log.Debugf("user borrow: %v", ub)
		if err != nil {
			return nil, err
		}
		userBorrows = append(userBorrows, ub)
	}
	return userBorrows, err
}

func DBAddUserBorrow(userBorrow UserBorrow) error {
	coll := cli.Database("book-mgr").Collection("user_borrow")
	res, err := coll.InsertOne(context.TODO(), userBorrow)
	if err != nil {
		return err
	}
	log.Println("insert id is:", res.InsertedID)
	return nil
}
