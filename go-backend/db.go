package main

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

var cli *mongo.Client

func init() {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://47.103.117.125:27017"))
	if err != nil {
		logger.Panic(err)
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
		cur, err = coll.Find(context.TODO(), bson.M{"user": primitive.Regex{Pattern: name}})
	}
	logger.Debug("name:", name)
	var userBorrows []UserBorrow
	for cur.Next(context.TODO()) {
		var ub UserBorrow
		err = cur.Decode(&ub)
		logger.Debugf("user borrow: %v", ub)
		if err != nil {
			return nil, err
		}
		userBorrows = append(userBorrows, ub)
	}
	return userBorrows, err
}

func DBAddUserBorrow(userBorrow UserBorrow) error {
	// 1. 插入一条新的借阅数据
	coll := cli.Database("book-mgr").Collection("user_borrow")
	res, err := coll.InsertOne(context.TODO(), userBorrow)
	if err != nil {
		return err
	}
	logger.Debug("insert id is:", res.InsertedID)

	// 2. 查询这个人这本书的借阅数据
	cur, err := coll.Find(context.TODO(), bson.M{"user": userBorrow.User, "book": userBorrow.Book})
	if err != nil {
		return err
	}
	defer func() {
		if err := cur.Close(context.TODO()); err != nil {
			logger.Error(err)
		}
	}()
	var userBorrows []UserBorrow
	for cur.Next(context.TODO()) {
		var ub UserBorrow
		err = cur.Decode(&ub)
		logger.Debugf("user borrow: %v", ub)
		if err != nil {
			return err
		}
		userBorrows = append(userBorrows, ub)
	}

	// 3. 删除这个人这本书的借阅数据
	dRes, err := coll.DeleteMany(context.TODO(), bson.M{"user": userBorrow.User, "book": userBorrow.Book})
	if err != nil {
		return err
	}
	logger.Debug(dRes.DeletedCount)

	// 4. 将借阅记录合并成一条
	var data UserBorrow
	for _, u := range userBorrows {
		if u.IsReturn {
			data.Number -= u.Number
		} else {
			data.Number += u.Number
		}
	}
	if data.Number > 0 {
		data.IsReturn = false
	} else {
		data.IsReturn = true
	}
	data.User = userBorrow.User
	data.Book = userBorrow.Book
	data.Date = userBorrow.Date

	// 5. 判断是否过期，后插入合并后的借阅记录
	bTime, err := time.Parse("2006-01-02", userBorrow.Date)
	if err != nil {
		return err
	}
	if time.Now().AddDate(0, 0, -15).After(bTime) {
		data.IsOverdue = true
	} else {
		data.IsOverdue = false
	}
	iRes, err := coll.InsertOne(context.TODO(), data)
	if err != nil {
		return err
	}
	logger.Debug("insert id is:", iRes.InsertedID)
	return nil
}

func RefreshOverDue() error {
	// 1. 查询所有未过期的借记录
	coll := cli.Database("book-mgr").Collection("user_borrow")
	cur, err := coll.Find(context.TODO(), bson.M{"is_return": false, "is_overdue": false})
	if err != nil {
		return err
	}
	defer func() {
		if err := cur.Close(context.TODO()); err != nil {
			logger.Error(err)
		}
	}()
	var userBorrows []UserBorrow
	for cur.Next(context.TODO()) {
		var ub UserBorrow
		err = cur.Decode(&ub)
		logger.Debugf("user borrow: %v", ub)
		if err != nil {
			return err
		}
		userBorrows = append(userBorrows, ub)
	}

	// 2. 单个判断是否过期，并更新
	for _, ub := range userBorrows {
		bTime, err := time.Parse("2006-01-02", ub.Date)
		if err != nil {
			return err
		}
		if time.Now().AddDate(0, 0, -15).After(bTime) {
			ub.IsOverdue = true
			filter := bson.D{{"user", ub.User}, {"book", ub.Book}}
			update := bson.D{{"$set", bson.D{{"is_overdue", true}}}}
			_, err := coll.UpdateOne(context.TODO(), filter, update)
			if err != nil {
				return err
			}
		}
	}

	return nil
}
