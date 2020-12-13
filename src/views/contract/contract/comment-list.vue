<template>
  <div>
    <el-divider>
      备注
    </el-divider>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="6em"
    >
      <el-form-item
        label="备注内容"
        prop="comment"
      >
        <tinymce
          v-model="form.comment"
          menubar="edit insert view format table"
          :toolbar="[
            'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent blockquote undo redo removeformat subscript superscript code codesample',
            'hr bullist numlist link charmap preview anchor pagebreak insertdatetime table emoticons forecolor backcolor fullscreen'
          ]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="submitting"
          @click="onSubmit"
        >
          提交
        </el-button>
      </el-form-item>
    </el-form>
    <el-divider>
      备注列表
    </el-divider>
    <div
      v-loading="dataLoading"
      class="comment-list"
    >
      <div
        v-for="item of items"
        :key="item.id"
        class="post"
      >
        <div class="user-block">
          <img
            class="img-circle"
            src="https://wpimg.wallstcn.com/57ed425a-c71e-4201-9428-68760c0537c4.jpg?imageView2/1/w/80/h/80"
          >
          <span
            v-if="item.commented_user.id"
            class="username text-muted"
          >
            {{ item.commented_user.first_name }} {{ item.commented_user.last_name }} ({{ item.commented_user.username }} )
          </span>
          <span
            v-else
            class="username text-muted"
          >
            {{ item.commented_by }} (User Removed)
          </span>
          <span class="description">{{ item.submitted_at | parseMoment }}</span>
        </div>
        <el-button-group class="actions">
          <el-button
            icon="el-icon-delete"
            size="small"
            @click="onItemDelete(item)"
          />
        </el-button-group>
        <!-- eslint-disable vue/no-v-html -->
        <p v-html="item.comment" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Tinymce from '@/components/Tinymce/index.vue'
import { ICommentData, IUserData } from '@/api/types'
import { getComments, createComment, deleteComments } from '@/api/comments'
import { ElForm } from 'element-ui/types/form'
import { UserModule } from '@/store/modules/user'

@Component({
  components: {
    Tinymce
  }
})
export default class CommentList extends Vue {
  @Prop({ required: true }) private appLabel!: string
  @Prop({ required: true }) private model!: string
  @Prop({ required: true }) private objectId!: string | number

  private form = {
    comment: ''
  }

  private rules = {
    comment: [
      { required: true, max: 5000, trigger: 'input' }
    ]
  }

  private submitting = false
  private dataLoading = false
  private items: ICommentData[] = []

  created() {
    this.init()
  }

  init() {
    this.dataLoading = true
    const params = {
      app_label: this.appLabel,
      model: this.model,
      object_id: this.objectId,
      page_size: 999,
      ordering: '-submitted_at'
    }
    getComments(params).then(({ data }) => {
      this.items = data.results
    }).catch((err: any) => {
      console.error(err)
      this.$notify.error('获取备注列表失败')
    }).finally(() => {
      this.dataLoading = false
    })
  }

  onSubmit() {
    (this.$refs.form as ElForm).validate((valid: boolean) => {
      if (valid) {
        const params = {
          ...this.form,
          app_label: this.appLabel,
          model: this.model,
          object_id: this.objectId,
          commented_by: UserModule.username
        }
        this.submitting = true
        createComment(params).then(({ data }) => {
          this.$notify.success('操作成功')
          this.form.comment = ''
          this.items.unshift(data)
        }).catch((err: any) => {
          console.error(err)
          this.$notify.error('操作失败')
          const { data, status, statusText } = err.response
          const msgs: string[] = []
          for (const [k, v] of Object.entries(data)) {
            msgs.push(
              `${k}: ${(v as string[]).join(',')}`
            )
          }
          this.$notify.error({
            title: `${status} ${statusText}`,
            message: msgs.join(';')
          })
        }).finally(() => {
          this.submitting = false
        })
      } else {
        this.$notify.warning('请正确填写表格')
        return false
      }
    })
  }

  onItemDelete(item: ICommentData) {
    this.deleteItems([item])
  }

  deleteItems(items: ICommentData[]) {
    const content = ['确认删除以下评论吗?']
    const selected = [] as number[]
    for (const item of items) {
      selected.push(item.id || 0)
      const commentedUser = item.commented_user as IUserData
      if (commentedUser.id) {
        content.push(
          `${commentedUser.first_name} ${commentedUser.last_name} (${commentedUser.username})-${moment(item.submitted_at).format()}`
        )
      } else {
        content.push(
          `${commentedUser.username} (User Removed)-${moment(item.submitted_at).format()}`
        )
      }
    }

    this.$confirm(content.join('<br/>'), '确认', {
      dangerouslyUseHTMLString: true,
      type: 'warning'
    }).then(() => {
      // confirmed
      const params = {
        id__in: selected.join(',')
      }
      this.dataLoading = true
      deleteComments(params).then(() => {
        const tmp = []
        for (const item of this.items) {
          if (selected.includes(item.id || 0)) {
            continue
          }
          tmp.push(item)
        }
        this.items = tmp
        this.$notify.success('操作成功')
      }).catch((err: any) => {
        console.error(err)
        this.$notify.error('操作失败')
      }).finally(() => {
        this.dataLoading = false
      })
    }).catch(() => {
      this.$message('操作取消')
    })
  }
}
</script>

<style lang="scss" scoped>
.comment-list {
  .user-block {
    display: inline-block;

    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username {
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .actions {
    float: right;
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;
    }

    .user-images {
      padding-top: 20px;
    }
  }

}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
</style>
