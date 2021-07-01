import { Button, Progress, Switch } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import ReactPlayer from 'react-player'

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
    {/* {JSON.stringify(current)} */}
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

        {!uploading && current.video && current.video.Location && (
            <div className="d-flex justify-content-center">
              <ReactPlayer controls url={current.video.Location} width="410px" height="240px" />
            </div>
          )}

        <div className="d-flex justify-content-center">
          <label className="btn btn-dark col-md-8 m-2">
            {uploadVideoText}
            <input onChange={handleVideo} type="file" accept="video/*" hidden />
          </label>
        </div>

        {progress > 0 && (
          <Progress className="d-flex justify-content-center pt-2 pb-2" percent={progress} steps={10} />
        )}

        <div className="d-flex justify-content-center">
          <span style={{ color: '#000', backgroundColor: '#4ef4b7', border: '1px solid #eee', letterSpacing: '1px' }} className="p-2 m-2 badge">PREVIEW</span>
          <Switch 
            className="pull-right mt-2 align-middle" 
            disabled={uploading} 
            defaultChecked={current.free_preview}
            name="free_preview"
            onChange={v => setCurrent({ ...current, free_preview: v })}
            />
        </div>

        <Button
          onClick={handleLessonUpdate}
          className="col-md-8 mt-3 ml-3 btn btn-primary"
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
