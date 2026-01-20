import React, { useEffect, useState } from 'react';
import { Briefcase, AlertCircle, Loader2, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api'; // твой настроенный axios

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await api.get('/projects/my');
        setProjects(response.data);
      } catch (err: any) {
        setError('Не удалось загрузить проекты. Попробуйте позже.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>Загрузка ваших проектов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Мои проекты</h1>
          <p className="text-gray-500">Управление и мониторинг ваших текущих проектов</p>
        </div>
        <Link 
          to="/dashboard/projects/new" 
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Новый проект</span>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Проектов пока нет</h3>
          <p className="text-gray-500 mb-6">Зарегистрируйте свой первый проект, чтобы начать работу.</p>
          <Link 
            to="/dashboard/projects/new" 
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Зарегистрировать проект &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {projects.map((project) => (
            <div key={project.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{project.title}</h3>
                  <p className="text-sm text-gray-500">{project.description || 'Нет описания'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {project.status === 'active' ? 'Активен' : 'В ожидании'}
                </span>
                <button className="text-gray-400 hover:text-blue-600">
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;