<template>
  <div class="user">
    <a-card>
      <h2>用户管理</h2>

      <a-divider></a-divider>


      <space-between>
      <div class="search">
        <a-input-search
          placeholder="请输入姓名查询"
          enter-button
          v-model:value="keyword"
          @search = "onSearch"
        />

        <a v-if="isSearch" href="javascript:;" @click="backAll">返回</a>
      </div>
      <a-button @click="showAddModal = true">添加用户</a-button>
      </space-between>

      <a-divider></a-divider>

      <div>
        <a-table
          bordered
          :columns="columns"
          :data-source="list"
          :pagination="false"
        >

          <template #createdAt = "{record}">
            {{formatTimeStamp(record.meta.createdAt)}}
          </template>

          <template #character = "{record}">
            {{ getCharacterInfoById(record.character).title}}
          </template>


          <template #actions = "{record}">
            <a href="javascript:;">重置密码</a>
            &nbsp;
            <a href="javascript:;" @click="remove(record)">删除</a>
          </template>

        </a-table>
      </div>

      <flex-end style = "margin-top: 24px">
        <a-pagination
          v-model:current= "curPage"
          :total="total"
          :page-size="10"
          @change="setPage"
        />

      </flex-end>
    </a-card>
    <add-one
      v-model:show="showAddModal"
      @getList="getUser"
    />
  </div>
</template>

<script src ="./index.js"></script>

<style lang="scss">
@import "./index.scss";
</style>
