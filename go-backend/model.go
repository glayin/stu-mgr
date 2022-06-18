package main

type UserBorrow struct {
	User      string `json:"user" bson:"user"`
	Book      string `json:"book" bson:"book"`
	Date      string `json:"date" bson:"date"`
	Number    int    `json:"number" bson:"number"`
	IsReturn  bool   `json:"is_return" bson:"is_return"`
	IsOverdue bool   `json:"is_overdue" bson:"is_overdue"`
}
