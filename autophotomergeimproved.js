var runphotomergeFromScript = true; // must be before Photomerge include
//@includepath "/C/Program Files/Adobe/Adobe Photoshop CC 2019/Presets/Scripts/"
//@include "Photomerge.jsx"
//@show include

var psdOpts = new PhotoshopSaveOptions();
psdOpts.embedColorProfile = true;
psdOpts.alphaChannels = true;
psdOpts.layers = true;

(function()
{
	var workFolder = Folder.selectDialog();
	if (workFolder == null) return false;
	
	var folders = workFolder.getFiles(function(file)
	{
		return file instanceof Folder;
	});

	if (folders.length == 0) return false

	for (var i = 0; i < folders.length; i++)
	{
		var subFolders = [];

		var subFolders = folders[i].getFiles(function(file)
		{
			return file instanceof Folder;
		});

		if (subFolders.length == 0) 
		{
			continue;
		}
		else
		{
			for (var j = 0; j < subFolders.length; j++)
			{
				var pictureFolders = [];

				var pictureFolders = subFolders[j].getFiles(function(file)
				{
					return file instanceof Folder;
				});

				if (pictureFolders.length == 0)
				{
					continue;
				}
				else
				{
					for (var k = 0; k < pictureFolders.length; k++)
					{
						if (pictureFolders[k].name == 'Visible')
						{
							var fList = pictureFolders[k].getFiles('*.jpg');

        						// override Photomerge.jsx settings. Default is "Auto". Uncomment to override the default.
        						//photomerge.alignmentKey = "Auto";
        						//photomerge.alignmentKey   = "Prsp";
        						//photomerge.alignmentKey   = "cylindrical";
        						//photomerge.alignmentKey   = "spherical";
        						//photomerge.alignmentKey   = "sceneCollage";
        						photomerge.alignmentKey = "translation"; // "Reposition" in layout dialog   

        						// other setting that may need to be changed. Defaults below
        						photomerge.advancedBlending = false; // 'Blend Images Together' checkbox in dialog
        						photomerge.lensCorrection = false; // Geometric Distortion Correction'checkbox in dialog
        						photomerge.removeVignette = false; // 'Vignette Removal' checkbox in dialog

        						try
       							{
            							if (fList.length > 1)
            							{
                							photomerge.createPanorama(fList, false);
            							}
        						}
        						catch (e)
        						{
            							alert(e + '\nLine: ' + e.line)
        						}
        						// saving
        						var saveFile = {
            							name: pictureFolders[k].name,
            							path: fList[0].parent
        						}

        						savePSB(saveFile)
        						//saveTIF(saveFile)
        						//saveJPG(saveFile)
        						//savePSD(saveFile)

        						activeDocument.close(SaveOptions.DONOTSAVECHANGES);
						}
						else
						{continue;}
					}
				}
			}
		}		
	}

	return false	
})()


function savePSB(data)
{
    var desc = new ActionDescriptor();
    var descCompatibility = new ActionDescriptor();
    descCompatibility.putBoolean(stringIDToTypeID('maximizeCompatibility'), true);
    desc.putObject(charIDToTypeID('As  '), charIDToTypeID('Pht8'), descCompatibility);
    desc.putPath(charIDToTypeID('In  '), new File(data.path + "/" + data.name + ".psb"));
    executeAction(charIDToTypeID('save'), desc, DialogModes.NO);
}; // end of savePSB()

function saveTIF(data)
{
    var desc = new ActionDescriptor();
    var descOptions = new ActionDescriptor();
    descOptions.putEnumerated(charIDToTypeID('BytO'), charIDToTypeID('Pltf'), charIDToTypeID('Mcnt'));
    descOptions.putEnumerated(stringIDToTypeID('layerCompression'), charIDToTypeID('Encd'), stringIDToTypeID('RLE'));
    desc.putObject(charIDToTypeID('As  '), charIDToTypeID('TIFF'), descOptions);
    desc.putPath(charIDToTypeID('In  '), new File(data.path + "/" + data.name + ".tif"));
    executeAction(charIDToTypeID('save'), desc, DialogModes.NO);
}; // end of saveTIF()

function saveJPG(data)
{
    if (data.path == undefined) return false;
    data.name = data.name == undefined ? activeDocument.name : data.name;
    data.quality == undefined && data.quality = 75

    var options = new ExportOptionsSaveForWeb(),
        jpgFile = new File(data.path + '/' + data.name + '.jpg');
    options.format = SaveDocumentType.JPEG;
    options.quality = data.quality;
    activeDocument.exportDocument(jpgFile, ExportType.SAVEFORWEB, options);
}

function savePSD(data)
{
    var desc = new ActionDescriptor();
    var descOptions = new ActionDescriptor();
    descOptions.putBoolean(stringIDToTypeID('maximizeCompatibility'), true);
    desc.putObject(charIDToTypeID('As  '), charIDToTypeID('Pht3'), descOptions);
    desc.putPath(charIDToTypeID('In  '), new File(data.path + "/" + data.name + ".psd"));
    executeAction(charIDToTypeID('save'), desc, DialogModes.NO);
} // end of savePSD()