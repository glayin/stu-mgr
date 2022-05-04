<template>
  <div class="user">
    <a-card>
      <h2>用户管理</h2>

      <a-divider></a-divider>

      <a-button>添加用户</a-button>

      <a-divider></a-divider>

      <div>
        <a-table
          bordered
          :pagaination="false"
          :columns="columns"
          :data-source="list"
        >

          <template #createdAt = "{record}">
            {{formatTimeStamp(record.meta.createdAt)}}
          </template>

          <template #actions = "{record}">
            <a href="javascript:;">重置密码</a>
            &nbsp;
            <a href="javascripy:;">删除</a>
          </template>

        </a-table>
      </div>

      <flex-end style = "margin-top: 24px">
        <a-pagination>

        </a-pagination>
      </flex-end>
    </a-card>
  </div>
</template>

<script src ="./index.js"></script>

<style lang="scss">
@import "./index.scss";
</style>
