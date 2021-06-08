import { Select, Button, Avatar, Badge } from 'antd'

const { Option } = Select

const CourseCreateForm = ({
  handleSubmit,
  handleChange,
  handleImage,
  handleImageRemove,
  values,
  setValues,
  preview,
  uploadImageText }) => {
  const children = []

  for (let i = 9.99; i <= 100.00; i++) {
    children.push(<Option key={i.toFixed(2)}>£{i.toFixed(2)}</Option>)
  }

  return (
    <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Course Name"
            value={values.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group pt-3">
          <textarea
            className="form-control"
            name="description"
            cols="7"
            rows="7"
            value={values.description}
            onChange={handleChange}
            ></textarea>
        </div>

        <div className="form-row pt-3">
          <div className="col">
            <div className="form-group">
              <Select
                style={{ width: "100%" }}
                size="large"
                value={values.paid}
                onChange={(v) => setValues({ ...values, paid: !values.paid })}
              >
                <Option value={true}>Paid</Option>
                <Option value={false}>Free</Option>
              </Select>
            </div>
          </div>
          {values.paid && (
            <div className="form-group">
              <Select
                defaultValue="£9.99"
                style={{ width: '100%' }}
                onChange={v => setValues({ ...values, price: v })}
                tokenSeparators={[,]}
                size="large">
                {children}
              </Select>
            </div>
          )}
        </div>

        <div className="form-group pt-2">
          <input
            type="text"
            name="category"
            className="form-control"
            placeholder="Course Category"
            value={values.category}
            onChange={handleChange}
          />
        </div>

        <div className="form-row pt-2 pb-2">
          <div className="col">
            <div className="form-group">
              <label className="btn  btn-outline-secondary text-left">
                {uploadImageText}
                <input
                  type="file"
                  name="image"
                  onChange={handleImage}
                  accept="image/*"
                  hidden
                />
              </label>
              {preview && (
                <Badge count="X" style={{ cursor: 'pointer' }} onClick={handleImageRemove}>
                  <Avatar className="m-2" width={200} src={preview} />
                </Badge>
               )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Button
              onClick={handleSubmit}
              disabled={values.loading || values.uploading}
              className="btn btn-primary"
              loading={values.loading}
              type="primary"
              size="large"
              shape=""
            >
              {values.loading ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </div>
      </form>
  )
}

export default CourseCreateForm
