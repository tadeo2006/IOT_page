import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { createTask, deleteTask, uptadeTask, getTask } from "../api/tasks.api";
import { useNavigate, useParams } from "react-router-dom";

export function TasksFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const params = useParams();

  const onSubmit = handleSubmit(async (data) => {
    if (params.id) {
      await uptadeTask(params.id, data);
    } else {
      await createTask(data);
    }
    navigate("/tasks");
  });

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const {
          data: { title, description },
        } = await getTask(params.id);
        setValue("title", title);
        setValue("description", description);
      }
    }
    loadTask();
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="title"
          {...register("title", { required: true })}
          className="bg-zinc-700 p-3 rounded-lg block w-full mb3"
        />
        {errors.title && <span>Este campo es requerido</span>}

        <textarea
          rows="3"
          placeholder="description"
          {...register("description", { required: true })}
          className="bg-zinc-700 p-3 rounded-lg block w-full mb3"
        ></textarea>
        {errors.description && <span>this file is required</span>}

        <button className="bg-indigo-500 p-3 rounded-lg block w-full mt-3">
          Save
        </button>
      </form>

      {params.id && (
        <div className="flex justify-end">
          <button
            className="bg-red-500 p-3 rounded-lg block w-48 mt-3"
            onClick={async () => {
              const acceptad = window.confirm("Are you sure?");
              if (acceptad) {
                await deleteTask(params.id);
                navigate("/tasks");
              }
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
