export const config = {
    NEWARepository: {
        url: 'https://github.com/TalissonJunior/NodeExpressWebApi.git',
        name: 'NodeExpressWebApi',
        databaseConfigPath: 'src/Config/config.json',
        modelsPath: 'src/Models/Database/',
        serverFilePath: 'src/server.ts',
        repositoryPaths: {
            interfaces: 'src/Repository/Interfaces/',
            main: 'src/Repository/Repositories/',
            extension: 'Repository.ts'
        },
        businessPaths: {
            interfaces: 'src/Business/Interfaces/',
            main: 'src/Business/Rules/',
            factories: 'src/Business/Factories/',
            extension: 'Business.ts'
        },
        controllerPaths: {
            interfaces: 'src/Controller/Interfaces/',
            main: 'src/Controller/Controllers/',
            extension: 'Controller.ts'
        },
        baseFoldersStructure: [
            'src/models',
            'src/repository',
            'src/controller',
            'src/business',
            'src/config',
            'gulpfile.js',
            'package.json',
            'tsconfig.json'
        ]
    },
};
  