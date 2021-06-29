import { Button, Progress, Tooltip } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'

const UpdateLessonForm = ({
  current,
  setCurrent,
  handleVideo,
  uploading,
  uploadVideoText,
  handleLessonUpdate,
  progress,
 }) => {

  return (
    <div className="container pt-3">
      <form onSubmit={handleLessonUpdate}>
        <input
          type="text"
          className="form-control square"
          onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          value={current.title}
          autoFocus
          required
        />

        <textarea
          className="form-control mt-3"
          cols="7"
          rows="7"
          onChange={(e) => setCurrent({ ...current, content: e.target.value })}
          value={current.content}
        ></textarea>

        <div className="d-flex justify-content-center">
          <label className="btn btn-dark col-md-8 m-2">
            {uploadVideoText}
            <input onChange={handleVideo} type="file" accept="video/*" hidden />
          </label>
          
        </div>

        {!uploading && current.video && current.video.Location && (
            <div className="d-flex justify-content-center">
              video
            </div>
          )}

        {progress > 0 && (
          <Progress className="d-flex justify-content-center pt-2 pb-2" percent={progress} steps={10} />
        )}

        <div className="d-flex justify-content-center">
          <span style={{ color: '#000' }} className="pt-2 badge">Preview</span>
        </div>

        <Button
          onClick={handleLessonUpdate}
          className="col-md-8 mt-2 btn btn-primary"
          size="large"
          type="primary"
          loading={uploading}
          shape="round"
        >
          Save Lesson
        </Button>
      </form>
    </div>
  )
}

export default UpdateLessonForm
