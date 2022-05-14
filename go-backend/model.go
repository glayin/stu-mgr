package main

type UserBorrow struct {
	User     string `json:"user"`
	Book     string `json:"book"`
	Date     string `json:"date"`
	Number   int    `json:"number"`
	IsReturn bool   `json:"is_return"`
}
