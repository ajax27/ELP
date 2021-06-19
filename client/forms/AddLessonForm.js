import { Button, Progress, Tooltip } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'

const AddLessonForm = ({
  values,
  setValues,
  handleAddLesson,
  uploading,
  uploadButtonText,
  handleVideo,
  progress,
  handleVideoRemove,
 }) => {
  return (
    <div className="container pt-3">
      <form onSubmit={handleAddLesson}>
        <input
          type="text"
          className="form-control square"
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          values={values.title}
          placeholder="Title"
          autoFocus
          required
        />

        <textarea
          className="form-control mt-3"
          cols="7"
          rows="7"
          onChange={(e) => setValues({ ...values, content: e.target.value })}
          values={values.content}
          placeholder="Content"
        ></textarea>

        <div className="d-flex justify-content-center">
          <label className="btn btn-dark col-md-10 m-2">
            {uploadButtonText}
            <input onChange={handleVideo} type="file" accept="video/*" hidden />
          </label>
          {!uploading && values.video.Location && (
            <Tooltip color="red" title="Remove Video">
              <span onClick={handleVideoRemove} className="pt-1 pl-3">
                <CloseCircleFilled
                  style={{ cursor: 'pointer' }}
                  className="d-flex justify-content-center text-danger pt-3"
                />
              </span>
            </Tooltip>
          )}
        </div>

        {progress > 0 && (
          <Progress className="d-flex justify-content-center p-2" percent={progress} steps={10} />
        )}

        <Button
          onClick={handleAddLesson}
          className="col-md-10 mt-1"
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

export default AddLessonForm
